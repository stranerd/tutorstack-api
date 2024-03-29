import { BaseMapper } from 'equipped'
import { AnswerEntity } from '../../domain/entities/answers'
import { AnswerFromModel, AnswerToModel } from '../models/answers'

export class AnswerMapper extends BaseMapper<AnswerFromModel, AnswerToModel, AnswerEntity> {
	mapFrom (model: AnswerFromModel | null) {
		if (!model) return null
		const {
			_id, questionId, attachment, user, createdAt, updatedAt
		} = model
		return new AnswerEntity({
			id: _id.toString(), questionId, user, attachment,
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
