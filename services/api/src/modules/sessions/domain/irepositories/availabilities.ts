import { QueryParams, QueryResults } from 'equipped'
import { AvailabilityEntity } from '../entities/availabilities'

export interface IAvailabilityRepository {
	get (query: QueryParams): Promise<QueryResults<AvailabilityEntity>>

	getUser (userId: string): Promise<AvailabilityEntity>

	update (userId: string, time: number, add: boolean): Promise<AvailabilityEntity | null>

	removeOld (): Promise<boolean>
}