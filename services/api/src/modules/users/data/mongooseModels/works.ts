import { WorkDbChangeCallbacks } from '@utils/changeStreams/users/works'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { WorkEntity } from '../../domain/entities/works'
import { WorkMapper } from '../mappers/works'
import { WorkFromModel } from '../models/works'

const WorkSchema = new mongoose.Schema<WorkFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	institution: {
		type: String,
		required: true
	},
	position: {
		type: String,
		required: true
	},
	from: {
		type: Number,
		required: true
	},
	to: {
		type: Number,
		required: true
	},
	verification: {
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
}, { minimize: false })

export const Work = mongoose.model<WorkFromModel>('UsersWork', WorkSchema)

export const WorkChange = appInstance.db
	.generateDbChange<WorkFromModel, WorkEntity>(Work, WorkDbChangeCallbacks, new WorkMapper().mapFrom)