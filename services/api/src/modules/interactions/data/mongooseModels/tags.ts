import { TagDbChangeCallbacks } from '@utils/changeStreams/interactions/tags'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { TagEntity } from '../../domain/entities/tags'
import { TagMapper } from '../mappers/tags'
import { TagFromModel } from '../models/tags'

const Schema = new mongoose.Schema<TagFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	type: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	parent: {
		type: String,
		required: false,
		default: null
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

export const Tag = mongoose.model<TagFromModel>('InteractionsTag', Schema)

export const TagChange = appInstance.db
	.generateDbChange<TagFromModel, TagEntity>(Tag, TagDbChangeCallbacks, new TagMapper().mapFrom)
