import { PlanDataType, WalletsUseCases } from '@modules/payment'
import { QuestionsUseCases, SubjectsUseCases } from '@modules/questions'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class QuestionController {
	static async FindQuestion (req: Request) {
		return await QuestionsUseCases.find(req.params.id)
	}

	static async GetQuestion (req: Request) {
		const query = req.query as QueryParams
		return await QuestionsUseCases.get(query)
	}

	static async UpdateQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedAttachment = req.files.attachment?.[0] ?? null
		const changedAttachment = !!uploadedAttachment || req.body.attachment === null

		const data = validateReq({
			body: Schema.string().min(1, true),
			attachment: Schema.file().image().nullable()
		}, { ...req.body, attachment: uploadedAttachment })

		const attachment = uploadedAttachment ? await StorageUseCases.upload('questions/questions', uploadedAttachment) : null

		const updatedQuestion = await QuestionsUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: {
				body: data.body,
				...(changedAttachment ? { attachment } : {})
			}
		})

		if (updatedQuestion) return updatedQuestion
		throw new NotAuthorizedError()
	}

	static async CreateQuestion (req: Request) {
		const data = validateReq({
			body: Schema.string().min(1, true),
			subjectId: Schema.string().min(1),
			topic: Schema.string().min(3),
			attachment: Schema.file().image().nullable()
		}, { ...req.body, attachment: req.files.attachment?.[0] ?? null })

		const subject = await SubjectsUseCases.find(data.subjectId)
		if (!subject) throw new BadRequestError('subject not found')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('user not found')
		const wallet = await WalletsUseCases.get(user.id)
		if (wallet.subscription.data[PlanDataType.questions] < 1) throw new BadRequestError('you don\'t have any questions left')

		const attachment = data.attachment ? await StorageUseCases.upload('questions/questions', data.attachment) : null

		return await QuestionsUseCases.add({ ...data, attachment, user: user.getEmbedded() })
	}

	static async DeleteQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const isDeleted = await QuestionsUseCases.delete({ id: req.params.id, userId: authUserId })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async HoldQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const question = await QuestionsUseCases.hold({ id: req.params.id, userId: authUserId, hold: true })
		if (question) return question
		throw new NotAuthorizedError()
	}

	static async ReleaseQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const question = await QuestionsUseCases.hold({ id: req.params.id, userId: authUserId, hold: false })
		if (question) return question
		throw new NotAuthorizedError()
	}
}