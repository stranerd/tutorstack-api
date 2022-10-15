import { ILikeRepository } from '../../domain/irepositories/likes'
import { LikeMapper } from '../mappers/likes'
import { LikeFromModel, LikeToModel } from '../models/likes'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { Like } from '../mongooseModels/likes'
import { InteractionEntity } from '../../domain/types'

export class LikeRepository implements ILikeRepository {
	private static instance: LikeRepository
	private mapper: LikeMapper

	private constructor () {
		this.mapper = new LikeMapper()
	}

	static getInstance () {
		if (!LikeRepository.instance) LikeRepository.instance = new LikeRepository()
		return LikeRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<LikeFromModel>(Like, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async like (data: LikeToModel) {
		let like = await Like.findOne({ 'user.id': data.user.id, 'entity': data.entity })
		if (like?.value === data.value) {
			await like.delete()
			return this.mapper.mapFrom(like)!
		} else if (!like) like = new Like(data)
		else if (like.value !== data.value) like.value = data.value
		await like.save()
		return this.mapper.mapFrom(like)!
	}

	async find (id: string) {
		const like = await Like.findById(id)
		return this.mapper.mapFrom(like)
	}

	async deleteEntityLikes ({ type, id }: InteractionEntity) {
		const likes = await Like.deleteMany({ 'entity.type': type, 'entity.id': id })
		return !!likes.acknowledged
	}

	async updateUserBio (user: LikeToModel['user']) {
		const likes = await Like.updateMany({ 'user.id': user.id }, { $set: { user } })
		return !!likes.acknowledged
	}
}
