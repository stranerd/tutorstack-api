import { QueryParams } from '@stranerd/api-commons'
import { IViewRepository } from '../irepositories/views'
import { ViewToModel } from '../../data/models/views'

export class ViewsUseCase {
	repository: IViewRepository

	constructor (repo: IViewRepository) {
		this.repository = repo
	}

	async get (input: QueryParams) {
		return await this.repository.get(input)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async create (data: ViewToModel) {
		return await this.repository.add(data)
	}

	async delete (input: { id: string, userId: string }) {
		return await this.repository.delete(input.id, input.userId)
	}

	async deleteEntityViews (entity: ViewToModel['entity']) {
		return await this.repository.deleteEntityViews(entity)
	}

	async updateUserBio (user: ViewToModel['user']) {
		return await this.repository.updateUserBio(user)
	}
}