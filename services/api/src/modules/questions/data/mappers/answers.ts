import { BaseMapper } from '@stranerd/api-commons'
import { AnswerFromModel, AnswerToModel } from '../models/answers'
import { AnswerEntity } from '../../domain/entities/answers'

export class AnswerMapper extends BaseMapper<AnswerFromModel, AnswerToModel, AnswerEntity> {
	mapFrom (model: AnswerFromModel | null) {
		if (!model) return null
		const {
			_id, questionId, attachment, user, best, meta,
			createdAt, updatedAt
		} = model
		return new AnswerEntity({
			id: _id.toString(), questionId, user, best, attachment, meta,
			createdAt, updatedAt
		})
	}

	mapTo (entity: AnswerEntity) {
		return {
			attachment: entity.attachment,
			questionId: entity.questionId,
			user: entity.user
		}
	}
}
