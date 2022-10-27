import { PlanToModel } from '../../data/models/plans'
import { PlanEntity } from '../entities/plans'
import { QueryParams, QueryResults } from '@stranerd/api-commons'

export interface IPlanRepository {
	init: (data: PlanToModel[]) => Promise<PlanEntity[]>
	get: (query: QueryParams) => Promise<QueryResults<PlanEntity>>
	find: (id: string) => Promise<PlanEntity | null>
}
