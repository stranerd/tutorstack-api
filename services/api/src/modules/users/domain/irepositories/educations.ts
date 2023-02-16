import { QueryParams, QueryResults } from 'equipped'
import { EducationToModel } from '../../data/models/educations'
import { EducationEntity } from '../entities/educations'

export interface IEducationRepository {
	add: (data: EducationToModel) => Promise<EducationEntity>
	get: (condition: QueryParams) => Promise<QueryResults<EducationEntity>>
	find: (id: string) => Promise<EducationEntity | null>
	update: (id: string, userId: string, data: Partial<EducationToModel>) => Promise<EducationEntity | null>
	delete: (id: string, userId: string) => Promise<boolean>
}