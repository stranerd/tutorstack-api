import { LikeToModel } from '../../data/models/likes'
import { LikeEntity } from '../entities/likes'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { InteractionEntity } from '../types'

export interface ILikeRepository {
	like: (data: LikeToModel) => Promise<LikeEntity>
	get: (query: QueryParams) => Promise<QueryResults<LikeEntity>>
	find: (id: string) => Promise<LikeEntity | null>
	deleteEntityLikes: (entity: InteractionEntity) => Promise<boolean>
	updateUserBio: (user: LikeToModel['user']) => Promise<boolean>
}
