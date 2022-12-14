import { SessionEntity, SessionsUseCases } from '@modules/sessions'
import { UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	QueryKeys,
	QueryParams,
	Request,
	validate,
	Validation
} from '@stranerd/api-commons'
import { SubjectsUseCases } from '@modules/questions'
import { StorageUseCases } from '@modules/storage'
import {
	Currencies,
	MethodsUseCases,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { AuthRole } from '@utils/types'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { Ms100Live } from '@utils/modules/sessions/100ms'

export class SessionsController {
	static async getSessions (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'tutor.id', value: req.authUser!.id }, { field: 'students.id', value: req.authUser!.id }]
		query.authType = QueryKeys.or
		return await SessionsUseCases.get(query)
	}

	static async findSession (req: Request) {
		const session = await SessionsUseCases.find(req.params.id)
		if (!session || !session.getParticipants().includes(req.authUser!.id)) return null
		return session
	}

	static async createSession (req: Request) {
		const data = validate({
			tutorId: req.body.tutorId,
			invites: req.body.invites,
			subjectId: req.body.subjectId,
			topic: req.body.topic,
			description: req.body.description,
			attachments: req.files.attachments ?? [],
			startedAt: req.body.startedAt,
			lengthInMinutes: req.body.lengthInMinutes
		}, {
			tutorId: { required: true, rules: [Validation.isString] },
			invites: {
				required: true, rules: [
					Validation.isArrayOfX((cur) => Validation.isString(cur).valid, 'studentIds'),
					Validation.hasLessThanOrEqualToX(SessionEntity.maxMembers - 1, `cannot invite more than ${SessionEntity.maxMembers - 1} students to a session`)
				]
			},
			subjectId: { required: true, rules: [Validation.isString] },
			topic: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			description: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			attachments: {
				required: true, rules: [
					Validation.isArrayOfX((cur) => Validation.isFile(cur).valid, 'files'),
					Validation.isArrayOfX((cur) => Validation.isNotTruncated(cur as any).valid, 'less than the allowed limit')
				]
			},
			startedAt: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanX(Date.now(), 'cannot schedule a session in the past')]
			},
			lengthInMinutes: {
				required: true,
				rules: [Validation.isNumber, Validation.arrayContainsX(SessionEntity.lengthsInMinutes, (cur, val) => cur === val)]
			}
		})

		if (data.tutorId === req.authUser!.id) throw new BadRequestError('you can\'t book a session with yourself')
		const subject = await SubjectsUseCases.find(data.subjectId)
		if (!subject) throw new BadRequestError('subject not found')
		const memberIds = [...new Set([data.tutorId, req.authUser!.id, ...data.invites]).values()]
		const [tutor, user, ...invites] = await Promise.all(memberIds.map(async (userId) => await UsersUseCases.find(userId)))
		if (!tutor || !tutor.roles[AuthRole.isTutor]) throw new BadRequestError('tutor not found')
		if (!user) throw new BadRequestError('profile not found')
		if (invites.includes(null)) throw new BadRequestError('some invites not found')
		const members = [user, ...invites]
		const start = data.startedAt

		const attachments = await StorageUseCases.uploadMany('sessions/attachments', data.attachments)

		return await SessionsUseCases.add({
			tutor: tutor.getEmbedded(),
			students: members.map((m) => m!.getEmbedded()),
			subjectId: data.subjectId,
			topic: data.topic,
			description: data.description,
			attachments,
			startedAt: start,
			lengthInMinutes: data.lengthInMinutes,
			price: SessionEntity.getPrice(data.lengthInMinutes, members.length),
			currency: Currencies.USD
		})
	}

	static async payForSession (req: Request) {
		const useWallet = !!req.body.useWallet
		const authUserId = req.authUser!.id

		const { methodId, userId } = validate({
			methodId: req.body.methodId,
			userId: req.body.userId ?? authUserId
		}, {
			methodId: { required: true, rules: [Validation.isString] },
			userId: { required: !useWallet, rules: [Validation.isString] }
		})

		const session = await SessionsUseCases.find(req.params.id)
		if (!session || !session.students.map((s) => s.id).includes(userId)) throw new NotAuthorizedError()
		if (session.paid.includes(userId)) return true

		const email = session.students.find((s) => s.id === authUserId)!.bio.email
		let successful = false

		if (useWallet) {
			successful = await WalletsUseCases.updateAmount({ userId: authUserId, amount: 0 - session.price })
		} else {
			const method = await MethodsUseCases.find(methodId)
			if (!method || method.userId !== authUserId) throw new BadRequestError('invalid method')

			successful = await BraintreePayment.charge({
				token: method.token, amount: session.price, currency: session.currency
			})
		}

		await TransactionsUseCases.create({
			email, userId: authUserId, status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed,
			title: 'Paid for session', amount: 0 - session.price, currency: session.currency,
			data: { type: TransactionType.PayForSession, sessionId: session.id, userId }
		})

		return successful
	}

	static async closeSession (req: Request) {
		const ended = await SessionsUseCases.close({ id: req.params.id, tutorId: req.authUser!.id })
		if (ended) return ended
		throw new NotAuthorizedError()
	}

	static async cancelSession (req: Request) {
		const { reason } = validate({
			reason: req.body.reason
		}, {
			reason: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		const cancelled = await SessionsUseCases.cancel({ id: req.params.id, reason, userId: req.authUser!.id })
		if (cancelled) return cancelled
		throw new NotAuthorizedError()
	}

	static async rateSession (req: Request) {
		const data = validate({
			rating: parseInt(req.body.rating),
			message: req.body.message
		}, {
			rating: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(0), Validation.isLessThanOrEqualToX(5)]
			},
			message: { required: true, rules: [Validation.isString] }
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await SessionsUseCases.rate({
			...data, sessionId: req.params.id, user: user.getEmbedded()
		})
	}

	static async joinSession (req: Request) {
		const userId = req.authUser!.id
		const session = await SessionsUseCases.find(req.params.id)
		if (!session || !session.getParticipants().includes(userId)) throw new NotAuthorizedError()
		if (session.closedAt) throw new BadRequestError('session has been closed')
		const user = session.students.concat(session.tutor).find((u) => u.id === userId)!
		return await Ms100Live.getRoomToken({
			sessionId: session.id,
			userId: user.id,
			userName: user.bio.name.first,
			isTutor: session.tutor.id === userId,
			expiresIn: Math.abs(Date.now() - session.endedAt) + (10 * 60 * 1000)
		})
	}

	static async getSessionDetails (req: Request) {
		const sessionId = req.params.id
		return await Ms100Live.getSessions(sessionId)
	}
}