import { QueryParams } from 'equipped'
import { PlanToModel } from '../../data/models/plans'
import { IPlanRepository } from '../irepositories/plans'

export class PlansUseCase {
	repository: IPlanRepository

	constructor (repo: IPlanRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async init (data: PlanToModel[]) {
		return await this.repository.init(data)
	}
}