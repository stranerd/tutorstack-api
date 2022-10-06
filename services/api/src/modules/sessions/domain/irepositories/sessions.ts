import { SessionEntity } from '../entities/sessions'
import { SessionToModel } from '../../data/models/sessions'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { EmbeddedUser } from '../types'

export interface ISessionRepository {
	add: (data: SessionToModel) => Promise<SessionEntity>
	get: (condition: QueryParams) => Promise<QueryResults<SessionEntity>>
	find: (id: string) => Promise<SessionEntity | null>
	updateUserBio: (user: EmbeddedUser) => Promise<boolean>
	updatePaid: (id: string, userId: string, add: boolean) => Promise<boolean>
	close: (id: string, userId: string) => Promise<boolean>
	cancel: (id: string, userId: string, reason: string) => Promise<boolean>
}