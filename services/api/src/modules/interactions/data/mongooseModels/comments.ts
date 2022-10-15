import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { CommentFromModel } from '../models/comments'
import { CommentChangeStreamCallbacks } from '@utils/changeStreams/interactions/comments'
import { CommentEntity } from '../../domain/entities/comments'
import { CommentMapper } from '../mappers/comments'
import { CommentMetaType } from '../../domain/types'

const CommentSchema = new mongoose.Schema<CommentFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	body: {
		type: String,
		required: true
	},
	entity: {
		type: mongoose.Schema.Types.Mixed as unknown as CommentFromModel['entity'],
		required: true
	},
	user: {
		type: mongoose.Schema.Types.Mixed as unknown as CommentFromModel['user'],
		required: true
	},
	meta: Object.fromEntries(
		Object.keys(CommentMetaType).map((key) => [key, {
			type: Number,
			required: false,
			default: 0
		}])
	),
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

export const Comment = mongoose.model<CommentFromModel>('InteractionsComment', CommentSchema)

generateChangeStreams<CommentFromModel, CommentEntity>(Comment, CommentChangeStreamCallbacks, new CommentMapper().mapFrom).then()