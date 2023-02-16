import { PlanChangeStreamCallbacks } from '@utils/changeStreams/payment/plans'
import { generateChangeStreams, mongoose } from 'equipped'
import { PlanEntity } from '../../domain/entities/plans'
import { PlanDataType } from '../../domain/types'
import { PlanMapper } from '../mappers/plans'
import { PlanFromModel } from '../models/plans'

const PlanSchema = new mongoose.Schema<PlanFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	name: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	data: Object.fromEntries(
		Object.keys(PlanDataType).map((key) => [key, {
			type: Number,
			required: false,
			default: 0
		}])
	),
	interval: {
		type: mongoose.Schema.Types.Mixed,
		required: true
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
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Plan = mongoose.model<PlanFromModel>('PaymentPlan', PlanSchema)

generateChangeStreams<PlanFromModel, PlanEntity>(Plan, PlanChangeStreamCallbacks, new PlanMapper().mapFrom).then()