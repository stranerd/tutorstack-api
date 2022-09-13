import { AnswersUseCases, QuestionsUseCases, SubjectsUseCases } from '@modules/questions'
import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { StorageUseCases } from '@modules/storage'

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

		const data = validate({
			body: req.body.body,
			attachment: uploadedAttachment as any
		}, {
			body: { required: true, rules: [Validation.isString, Validation.isExtractedHTMLLongerThanX(2)] },
			attachment: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})
		if (uploadedAttachment) data.attachment = await StorageUseCases.upload('questions/questions', uploadedAttachment)
		const validateData = {
			body: data.body,
			...(changedAttachment ? { attachment: data.attachment } : {})
		}

		const updatedQuestion = await QuestionsUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: validateData
		})

		if (updatedQuestion) return updatedQuestion
		throw new NotAuthorizedError()
	}

	static async CreateQuestion (req: Request) {
		const data = validate({
			body: req.body.body,
			subjectId: req.body.subjectId,
			topic: req.body.topic,
			attachment: req.files.attachment?.[0] ?? null
		}, {
			body: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			subjectId: { required: true, rules: [Validation.isString] },
			topic: { required: true, rules: [Validation.isString, Validation.isLongerThanX(2)] },
			attachment: { required: true, nullable: true, rules: [Validation.isNotTruncated, Validation.isImage] }
		})

		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('user not found')
		const subject = await SubjectsUseCases.find(data.subjectId)
		if (!subject) throw new BadRequestError('subject not found')
		const attachment = data.attachment ? await StorageUseCases.upload('questions/questions', data.attachment) : null

		return await QuestionsUseCases.add({ ...data, attachment, user: user.getEmbedded() })
	}

	static async MarkBestAnswer (req: Request) {
		const authUserId = req.authUser!.id

		const { answerId } = validate({
			answerId: req.body.answerId
		}, {
			answerId: { required: true, rules: [Validation.isString] }
		})

		const question = await QuestionsUseCases.find(req.params.id)
		const answer = await AnswersUseCases.find(answerId)
		if (!question) throw new BadRequestError('question not found')
		if (!answer || answer.questionId !== question.id) throw new BadRequestError('invalid answer')
		if (question.user.id !== authUserId) throw new NotAuthorizedError()
		if (question.isAnswered) throw new BadRequestError('question is already answered')
		if (question.bestAnswers.find((a) => a === answerId)) throw new BadRequestError('answer is already marked best answer')

		return await QuestionsUseCases.updateBestAnswer({
			id: question.id,
			answerId,
			userId: authUserId,
			add: true
		})
	}

	static async DeleteQuestion (req: Request) {
		const authUserId = req.authUser!.id
		const isDeleted = await QuestionsUseCases.delete({ id: req.params.id, userId: authUserId })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}