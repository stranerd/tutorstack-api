import { BaseMapper } from '@stranerd/api-commons'
import { TagFromModel, TagToModel } from '../models/tags'
import { TagEntity } from '../../domain/entities/tags'

export class TagMapper extends BaseMapper<TagFromModel, TagToModel, TagEntity> {
	mapFrom (model: TagFromModel | null) {
		if (!model) return null
		const { _id, type, title, parent, createdAt, updatedAt } = model
		return new TagEntity({
			id: _id.toString(), type, title, parent, createdAt, updatedAt
		})
	}

	mapTo (entity: TagEntity) {
		return {
			type: entity.type,
			title: entity.title,
			parent: entity.parent
		}
	}
}
