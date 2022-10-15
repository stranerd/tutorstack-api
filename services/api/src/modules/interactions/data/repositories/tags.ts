import { ITagRepository } from '../../domain/irepositories/tags'
import { TagMapper } from '../mappers/tags'
import { TagFromModel, TagToModel } from '../models/tags'
import { Tag } from '../mongooseModels/tags'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'

export class TagRepository implements ITagRepository {
	private static instance: TagRepository
	private mapper: TagMapper

	private constructor () {
		this.mapper = new TagMapper()
	}

	static getInstance () {
		if (!TagRepository.instance) TagRepository.instance = new TagRepository()
		return TagRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<TagFromModel>(Tag, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: TagToModel) {
		const tag = await new Tag(data).save()
		return this.mapper.mapFrom(tag)!
	}

	async find (id: string) {
		const tag = await Tag.findById(id)
		return this.mapper.mapFrom(tag)
	}

	async update (id: string, data: Partial<TagToModel>) {
		const tag = await Tag.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
		return this.mapper.mapFrom(tag)
	}

	async delete (id: string) {
		const tag = await Tag.findOneAndDelete({ _id: id })
		return !!tag
	}
}
