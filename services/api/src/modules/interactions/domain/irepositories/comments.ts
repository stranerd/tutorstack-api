import { CommentToModel } from '../../data/models/comments'
import { CommentEntity } from '../entities/comments'
import { QueryParams, QueryResults } from '@stranerd/api-commons'
import { CommentMetaType, InteractionEntity } from '../types'

export interface ICommentRepository {
	add: (data: CommentToModel) => Promise<CommentEntity>
	get: (query: QueryParams) => Promise<QueryResults<CommentEntity>>
	find: (id: string) => Promise<CommentEntity | null>
	update: (id: string, userId: string, data: Partial<CommentToModel>) => Promise<CommentEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	deleteEntityComments: (entity: InteractionEntity) => Promise<boolean>
	updateMeta: (commentId: string, property: CommentMetaType, value: 1 | -1) => Promise<void>
	updateUserBio: (user: CommentToModel['user']) => Promise<boolean>
}
