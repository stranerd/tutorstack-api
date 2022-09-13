import { IQuestionRepository } from '../../domain/irepositories/questions'
import { QuestionMapper } from '../mappers/questions'
import { QuestionFromModel, QuestionToModel } from '../models/questions'
import { Question } from '../mongooseModels/questions'
import { Answer } from '../mongooseModels/answers'
import { mongoose, parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser, QuestionMetaType } from '../../domain/types'
import { BEST_ANSWERS_COUNT } from '../../domain/entities/questions'

export class QuestionRepository implements IQuestionRepository {
	private static instance: QuestionRepository
	private mapper: QuestionMapper

	private constructor () {
		this.mapper = new QuestionMapper()
	}

	static getInstance () {
		if (!QuestionRepository.instance) QuestionRepository.instance = new QuestionRepository()
		return QuestionRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<QuestionFromModel>(Question, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: QuestionToModel) {
		const question = await new Question(data).save()
		return this.mapper.mapFrom(question)!
	}

	async find (id: string) {
		const question = await Question.findById(id)
		return this.mapper.mapFrom(question)
	}

	async update (id: string, userId: string, data: Partial<QuestionToModel>) {
		const question = await Question.findOneAndUpdate({ _id: id, 'user.id': userId }, { $set: data })
		return this.mapper.mapFrom(question)
	}

	async updateBestAnswer (questionId: string, answerId: string, userId: string, add: boolean) {
		const session = await mongoose.startSession()
		let res = null as any
		await session.withTransaction(async (session) => {
			const question = await Question.findOneAndUpdate({
				_id: questionId, 'user.id': userId,
				...(add ? { [`bestAnswers.${BEST_ANSWERS_COUNT}`]: { $exists: false } } : { 'bestAnswers': answerId })
			}, {
				[add ? '$addToSet' : 'pull']: { bestAnswers: answerId }
			}, { session, new: true })
			const answer = question ? await Answer.findOneAndUpdate({
				_id: answerId,
				questionId
			}, { $set: { best: add } }, {
				session, new: true
			}) : null
			res = !!question && !!answer
			return res
		})
		await session.endSession()
		return res
	}

	async updateAnswers (id: string, answerId: string, userId: string, add: boolean) {
		const question = await Question.findByIdAndUpdate(id, {
			[add ? '$addToSet' : '$pull']: { answers: { id: answerId, userId } }
		}, { new: true })
		return !!question
	}

	async updateUserBio (user: EmbeddedUser) {
		const questions = await Question.updateMany({ 'user.id': user.id }, { $set: { user } })
		return questions.acknowledged
	}

	async delete (id: string, userId: string) {
		const question = await Question.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!question
	}

	async deleteSubjectQuestions (subjectId: string) {
		const questions = await Question.deleteMany({ subjectId })
		return questions.acknowledged
	}

	async updateMeta (id: string, property: QuestionMetaType, value: 1 | -1) {
		const question = await Question.findByIdAndUpdate(id, {
			$inc: { [`meta.${property}`]: value }
		})
		return !!question
	}
}
