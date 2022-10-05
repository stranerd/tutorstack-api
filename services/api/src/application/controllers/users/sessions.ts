import { SessionEntity, SessionsUseCases, UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	Request,
	validate,
	Validation
} from '@stranerd/api-commons'
import { SubjectsUseCases } from '@modules/questions'
import { StorageUseCases } from '@modules/storage'
import { CardsUseCases, Currencies, TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { StripePayment } from '@utils/modules/payment/stripe'

export class SessionsController {
	static async getSessions (req: Request) {
		const query = req.query as QueryParams
		return await SessionsUseCases.get(query)
	}

	static async findSession (req: Request) {
		const session = await SessionsUseCases.find(req.params.id)
		if (!session) throw new NotFoundError()
		if (!session.getParticipants().includes(req.authUser!.id)) throw new NotAuthorizedError()
		return session
	}

	static async createSession (req: Request) {
		const data = validate({
			tutorId: req.body.tutorId,
			invites: req.body.invites,
			subjectId: req.body.subjectId,
			topic: req.body.topic,
			description: req.body.description,
			attachments: req.files.attachments,
			startedAt: req.body.startedAt,
			lengthInMinutes: req.body.lengthInMinutes
		}, {
			tutorId: { required: true, rules: [Validation.isString] },
			invites: { required: true, rules: [
				Validation.isArrayOfX((cur) => Validation.isString(cur).valid, 'studentIds'),
				Validation.hasLessThanOrEqualToX(SessionEntity.maxMembers - 1, `cannot invite more than ${SessionEntity.maxMembers - 1} students to a session`)
			]},
			subjectId: { required: true, rules: [Validation.isString] },
			topic: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			description: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			attachments: { required: true, rules: [
				Validation.isArrayOfX((cur) => Validation.isFile(cur).valid, 'files'),
				Validation.isArrayOfX((cur) => Validation.isNotTruncated(cur as any).valid, 'less than the allowed limit')
			]},
			startedAt: { required: true, rules: [Validation.isNumber, Validation.isMoreThanX(Date.now(), 'cannot schedule a session in the past')] },
			lengthInMinutes: { required: true, rules: [Validation.isNumber, Validation.arrayContainsX(SessionEntity.lengthsInMinutes, (cur, val) => cur === val)] }
		})

		const subject = await SubjectsUseCases.find(data.subjectId)
		if (!subject) throw new BadRequestError('subject not found')
		const [tutor, user, ...invites]  = await Promise.all([data.tutorId, req.authUser!.id, ...data.invites]
			.map(async (userId) => await UsersUseCases.find(userId)))
		if (!tutor) throw new BadRequestError('tutor not found')
		if (!user) throw new BadRequestError('profile not found')
		if (invites.includes(null)) throw new BadRequestError('some invites not found')
		const members = [user, ...invites]
		const start = data.startedAt
		const end = start + (data.lengthInMinutes * 60 * 1000)
		if (!tutor!.isFreeBetween(start, end)) throw new BadRequestError('tutor is not free within this time period')
		if (!members.some((m) => !m!.isFreeBetween(start, end))) throw new BadRequestError('some users are not free within this time period')

		const attachments = await StorageUseCases.uploadMany('users/sessions/attachments', data.attachments)

		return await SessionsUseCases.add({
			tutor: tutor.getEmbedded(), students: members.map((m) => m!.getEmbedded()),
			subjectId: data.subjectId, topic: data.topic, description: data.description, attachments,
			startedAt: start, lengthInMinutes: data.lengthInMinutes, price: SessionEntity.getPrice(data.lengthInMinutes, members.length), currency: Currencies.USD
		})
	}

	static async payForSession (req: Request) {
		const data = validate({
			cardId: req.body.cardId
		}, {
			cardId: { required: true, rules: [Validation.isString] },
		})

		const userId = req.authUser!.id
		const session = await SessionsUseCases.find(req.params.id)
		if (!session || !session.students.map((s) => s.id).includes(userId)) throw new NotAuthorizedError()
		if (session.paid.includes(userId)) return true
		const card = await CardsUseCases.find(data.cardId)
		if (!card || card.userId !== userId) throw new BadRequestError('invalid card')
		const email = session.students.find((s) => s.id === userId)!.bio.email

		const successful = await StripePayment.chargeCard({
			userId: card.userId, email, token: card.token,
			currency: Currencies.USD, amount: 0
		})

		await TransactionsUseCases.create({
			email, userId, status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed,
			title: 'Paid for session', amount: session.price, currency: session.currency,
			data: {
				type: TransactionType.PayForSession,
				sessionId: session.id
			}
		})

		return successful
	}
}