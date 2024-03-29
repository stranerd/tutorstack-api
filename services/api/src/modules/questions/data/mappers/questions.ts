import { BaseMapper } from 'equipped'
import { QuestionEntity } from '../../domain/entities/questions'
import { QuestionFromModel, QuestionToModel } from '../models/questions'

export class QuestionMapper extends BaseMapper<QuestionFromModel, QuestionToModel, QuestionEntity> {
	mapFrom (model: QuestionFromModel | null) {
		if (!model) return null
		const {
			_id, body, subjectId, topic, attachment,
			user, answers, heldBy, meta, createdAt, updatedAt
		} = model
		return new QuestionEntity({
			id: _id.toString(), body, subjectId, topic, attachment,
			user, answers, heldBy, meta, createdAt, updatedAt
		})
	}

	mapTo (entity: QuestionEntity) {
		return {
			body: entity.body,
			attachment: entity.attachment,
			subjectId: entity.subjectId,
			topic: entity.topic,
			user: entity.user
		}
	}
}
