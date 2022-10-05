import { BaseMapper } from '@stranerd/api-commons'
import { AvailabilityEntity } from '../../domain/entities/availabilities'
import { AvailabilityFromModel, AvailabilityToModel } from '../models/availabilities'

export class AvailabilityMapper extends BaseMapper<AvailabilityFromModel, AvailabilityToModel, AvailabilityEntity> {
	mapFrom (param: AvailabilityFromModel | null) {
		return !param ? null : new AvailabilityEntity({
			id: param._id.toString(),
			userId: param.userId,
			free: param.free,
			booked: param.booked,
			createdAt: param.createdAt,
			updatedAt: param.updatedAt
		})
	}

	mapTo (param: AvailabilityEntity) {
		return {
			userId: param.userId
		}
	}
}