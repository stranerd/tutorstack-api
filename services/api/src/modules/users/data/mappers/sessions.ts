import { BaseMapper } from '@stranerd/api-commons'
import { SessionEntity } from '../../domain/entities/sessions'
import { SessionFromModel, SessionToModel } from '../models/sessions'

export class SessionMapper extends BaseMapper<SessionFromModel, SessionToModel, SessionEntity> {
	mapFrom (param: SessionFromModel | null) {
		return !param ? null : new SessionEntity({
			id: param._id.toString(),
			tutor: param.tutor,
			students: param.students,
			paid: param.paid,
			subjectId: param.subjectId,
			topic: param.topic,
			description: param.description,
			attachments: param.attachments,
			startedAt: param.startedAt,
			lengthInMinutes: param.lengthInMinutes,
			price: param.price,
			currency: param.currency,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: SessionEntity) {
		return {
			tutor: param.tutor,
			students: param.students,
			subjectId: param.subjectId,
			topic: param.topic,
			description: param.description,
			attachments: param.attachments,
			startedAt: param.startedAt,
			lengthInMinutes: param.lengthInMinutes,
			price: param.price,
			currency: param.currency
		}
	}
}