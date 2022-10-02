import { ISessionRepository } from '../irepositories/sessions'
import { SessionToModel } from '../../data/models/sessions'
import { QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser } from '../types'

export class SessionsUseCase {
	private repository: ISessionRepository

	constructor (repository: ISessionRepository) {
		this.repository = repository
	}

	async add (data: SessionToModel) {
		return await this.repository.add(data)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async updatePaid (data: { id: string, userId: string, add: boolean }) {
		return await this.repository.updatePaid(data.id, data.userId, data.add)
	}
}
