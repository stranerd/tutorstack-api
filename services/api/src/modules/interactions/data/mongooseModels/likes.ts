import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { LikeFromModel } from '../models/likes'
import { LikeChangeStreamCallbacks } from '@utils/changeStreams/interactions/likes'
import { LikeEntity } from '../../domain/entities/likes'
import { LikeMapper } from '../mappers/likes'

const LikeSchema = new mongoose.Schema<LikeFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	value: {
		type: Boolean,
		required: true
	},
	entity: {
		type: mongoose.Schema.Types.Mixed as unknown as LikeFromModel['entity'],
		required: true
	},
	user: {
		type: mongoose.Schema.Types.Mixed as unknown as LikeFromModel['user'],
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

export const Like = mongoose.model<LikeFromModel>('InteractionsLike', LikeSchema)

generateChangeStreams<LikeFromModel, LikeEntity>(Like, LikeChangeStreamCallbacks, new LikeMapper().mapFrom).then()