import { QueryParams, QueryResults } from 'equipped'
import { ViewToModel } from '../../data/models/views'
import { ViewEntity } from '../entities/views'
import { InteractionEntity } from '../types'

export interface IViewRepository {
	add: (data: ViewToModel) => Promise<ViewEntity>
	get: (query: QueryParams) => Promise<QueryResults<ViewEntity>>
	find: (id: string) => Promise<ViewEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
	deleteEntityViews: (entity: InteractionEntity) => Promise<boolean>
	updateUserBio: (user: ViewToModel['user']) => Promise<boolean>
}
