import { parseQueryParams, QueryParams } from 'equipped'
import { IViewRepository } from '../../domain/irepositories/views'
import { Interaction } from '../../domain/types'
import { ViewMapper } from '../mappers/views'
import { ViewFromModel, ViewToModel } from '../models/views'
import { View } from '../mongooseModels/views'

export class ViewRepository implements IViewRepository {
	private static instance: ViewRepository
	private mapper: ViewMapper

	private constructor () {
		this.mapper = new ViewMapper()
	}

	static getInstance () {
		if (!ViewRepository.instance) ViewRepository.instance = new ViewRepository()
		return ViewRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<ViewFromModel>(View, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add ({ entity, user }: ViewToModel) {
		const view = await View.findOneAndUpdate(
			{ entity, 'user.id': user },
			{ $setOnInsert: { entity, user } },
			{ new: true, upsert: true }
		)
		return this.mapper.mapFrom(view)!
	}

	async find (id: string) {
		const view = await View.findById(id)
		return this.mapper.mapFrom(view)
	}

	async delete (id: string, userId: string) {
		const view = await View.findOneAndDelete({ _id: id, 'user.id': userId })
		return !!view
	}

	async deleteEntityViews ({ type, id }: Interaction) {
		const views = await View.deleteMany({ 'entity.type': type, 'entity.id': id })
		return !!views.acknowledged
	}

	async updateUserBio (user: ViewToModel['user']) {
		const views = await View.updateMany({ 'user.id': user.id }, { $set: { user } })
		return !!views.acknowledged
	}
}
