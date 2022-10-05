import { IAvailabilityRepository } from '../irepositories/availabilities'
import { QueryParams } from '@stranerd/api-commons'

export class AvailabilitiesUseCase {
	repository: IAvailabilityRepository

	constructor (repo: IAvailabilityRepository) {
		this.repository = repo
	}

	async getUser (userId: string) {
		return await this.repository.getUser(userId)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { userId: string, time: number, add: boolean }) {
		return await this.repository.update(input.userId, input.time, input.add)
	}

	async removeOld () {
		return await this.repository.removeOld()
	}
}