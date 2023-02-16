import { QueryParams, QueryResults } from 'equipped'
import { WorkToModel } from '../../data/models/works'
import { WorkEntity } from '../entities/works'

export interface IWorkRepository {
	add: (data: WorkToModel) => Promise<WorkEntity>
	get: (condition: QueryParams) => Promise<QueryResults<WorkEntity>>
	find: (id: string) => Promise<WorkEntity | null>
	update: (id: string, userId: string, data: Partial<WorkToModel>) => Promise<WorkEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
}