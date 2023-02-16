import { QueryParams, QueryResults } from 'equipped'
import { QuestionToModel } from '../../data/models/questions'
import { QuestionEntity } from '../entities/questions'
import { EmbeddedUser, QuestionMetaType } from '../types'

export interface IQuestionRepository {
	add: (data: QuestionToModel) => Promise<QuestionEntity>
	get: (condition: QueryParams) => Promise<QueryResults<QuestionEntity>>
	find: (id: string) => Promise<QuestionEntity | null>
	update: (id: string, userId: string, data: Partial<QuestionToModel>) => Promise<QuestionEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	updateAnswers: (id: string, answerId: string, userId: string, add: boolean) => Promise<boolean>
	deleteSubjectQuestions: (subjectId: string) => Promise<boolean>
	hold: (id: string, userId: string, hold: boolean) => Promise<QuestionEntity | null>
	updateMeta: (id: string, property: QuestionMetaType, value: 1 | -1) => Promise<boolean>
}