import { AvailabilityDbChangeCallbacks } from '@utils/changeStreams/sessions/availabilities'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { AvailabilityEntity } from '../../domain/entities/availabilities'
import { AvailabilityMapper } from '../mappers/availabilities'
import { AvailabilityFromModel } from '../models/availabilities'

const AvailabilitySchema = new mongoose.Schema<AvailabilityFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	free: {
		type: [Number],
		required: false,
		default: []
	},
	booked: {
		type: [mongoose.Schema.Types.Mixed] as unknown as AvailabilityFromModel['booked'],
		required: false,
		default: []
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { minimize: false })

export const Availability = mongoose.model<AvailabilityFromModel>('SessionsAvailability', AvailabilitySchema)

export const AvailabilityChange = appInstance.db
	.generateDbChange<AvailabilityFromModel, AvailabilityEntity>(Availability, AvailabilityDbChangeCallbacks, new AvailabilityMapper().mapFrom)