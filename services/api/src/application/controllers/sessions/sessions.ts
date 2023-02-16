import {
	Currencies,
	MethodsUseCases,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { SubjectsUseCases } from '@modules/questions'
import { SessionEntity, SessionsUseCases } from '@modules/sessions'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { Ms100Live } from '@utils/modules/sessions/100ms'
import {
	AuthRole,
	BadRequestError,
	NotAuthorizedError,
	QueryKeys,
	QueryParams,
	Request,
	Schema, validateReq
} from 'equipped'

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
		const data = validateReq({
			tutorId: Schema.string().min(1),
			invites: Schema.array(Schema.string().min(1))
				.max(SessionEntity.maxMembers - 1, `cannot invite more than ${SessionEntity.maxMembers - 1} students to a session`),
			subjectId: Schema.string().min(1),
			topic: Schema.string().min(1),
			description: Schema.string().min(1),
			attachments: Schema.array(Schema.file()),
			startedAt: Schema.time().min(Date.now(), 'cannot schedule a session in the past').asStamp(),
			lengthInMinutes: Schema.number().in(SessionEntity.lengthsInMinutes)
		}, { ...req.body, attachments: req.files.attachments ?? [] })

		if (data.tutorId === req.authUser!.id) throw new BadRequestError('you can\'t book a session with yourself')
		const subject = await SubjectsUseCases.find(data.subjectId)
		if (!subject) throw new BadRequestError('subject not found')
		const memberIds = [...new Set([data.tutorId, req.authUser!.id, ...data.invites]).values()]
		const [tutor, user, ...invites] = await Promise.all(memberIds.map(async (userId) => await UsersUseCases.find(userId)))
		if (!tutor || !tutor.roles[AuthRole.isTutor]) throw new BadRequestError('tutor not found')
		if (!user) throw new BadRequestError('profile not found')
		if (invites.includes(null)) throw new BadRequestError('some invites not found')
		const members = [user, ...invites]

		const attachments = await StorageUseCases.uploadMany('sessions/attachments', data.attachments)

		return await SessionsUseCases.add({
			tutor: tutor.getEmbedded(),
			students: members.map((m) => m!.getEmbedded()),
			...data,
			attachments,
			price: SessionEntity.getPrice(data.lengthInMinutes, members.length),
			currency: Currencies.USD
		})
	}

	static async payForSession (req: Request) {
		const useWallet = !!req.body.useWallet
		const authUserId = req.authUser!.id

		const { methodId, userId } = validateReq({
			methodId: Schema.string().min(1),
			userId: Schema.string().min(1).default(authUserId)
		}, req.body)

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
		const { reason } = validateReq({
			reason: Schema.string().min(1)
		}, req.body)

		const cancelled = await SessionsUseCases.cancel({ id: req.params.id, reason, userId: req.authUser!.id })
		if (cancelled) return cancelled
		throw new NotAuthorizedError()
	}

	static async rateSession (req: Request) {
		const data = validateReq({
			rating: Schema.number().round(0).gte(0).lte(5),
			message: Schema.string()
		}, req.body)

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