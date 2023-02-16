import { QueryParams, QueryResults } from 'equipped'
import { ReviewToModel } from '../../data/models/reviews'
import { SessionToModel } from '../../data/models/sessions'
import { ReviewEntity } from '../entities/reviews'
import { SessionEntity } from '../entities/sessions'
import { EmbeddedUser } from '../types'

export interface ISessionRepository {
	add: (data: SessionToModel) => Promise<SessionEntity>
	get: (condition: QueryParams) => Promise<QueryResults<SessionEntity>>
	find: (id: string) => Promise<SessionEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	updatePaid: (id: string, userId: string, add: boolean) => Promise<boolean>
	close: (id: string, userId: string) => Promise<boolean>
	cancel: (id: string, userId: string, reason: string) => Promise<boolean>
	rate: (data: Omit<ReviewToModel, 'to'>) => Promise<ReviewEntity>
}