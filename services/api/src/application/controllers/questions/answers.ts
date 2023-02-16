import { AnswersUseCases, QuestionsUseCases } from '@modules/questions'
import { StorageUseCases } from '@modules/storage'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class AnswerController {
	static async FindAnswer (req: Request) {
		return await AnswersUseCases.find(req.params.id)
	}

	static async GetAnswers (req: Request) {
		const query = req.query as QueryParams
		return await AnswersUseCases.get(query)
	}

	static async UpdateAnswer (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedAttachment = req.files.attachment?.[0] ?? null
		const changedAttachment = !!uploadedAttachment || req.body.attachment === null

		validateReq({
			attachment: Schema.file().video()
		}, { ...req.body, attachment: uploadedAttachment })

		const attachment = uploadedAttachment ? await StorageUseCases.upload('questions/answers', uploadedAttachment) : undefined

		const updatedAnswer = await AnswersUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: {
				...(changedAttachment ? { attachment } : {})
			}
		})

		if (updatedAnswer) return updatedAnswer
		throw new NotAuthorizedError()
	}

	static async CreateAnswer (req: Request) {
		const data = validateReq({
			questionId: Schema.string().min(1),
			attachment: Schema.file().video()
		}, { ...req.body, attachment: req.files.attachment?.[0] ?? null })

		const authUserId = req.authUser!.id
		const question = await QuestionsUseCases.find(data.questionId)
		if (!question) throw new BadRequestError('question not found')
		if (question.isAnswered()) throw new BadRequestError('question already answered')
		if (!question.isHeldBy(authUserId)) throw new BadRequestError('you can\'t answer a question you are not holding')
		const user = await UsersUseCases.find(authUserId)
		if (!user) throw new BadRequestError('user not found')
		const attachment = await StorageUseCases.upload('questions/answers', data.attachment)
		return await AnswersUseCases.add({ ...data, attachment, user: user.getEmbedded() })
	}

	static async DeleteAnswer (req: Request) {
		const isDeleted = await AnswersUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}