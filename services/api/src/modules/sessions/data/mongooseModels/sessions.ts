import { SessionChangeStreamCallbacks } from '@utils/changeStreams/sessions/sessions'
import { generateChangeStreams, mongoose } from 'equipped'
import { SessionEntity } from '../../domain/entities/sessions'
import { SessionMapper } from '../mappers/sessions'
import { SessionFromModel } from '../models/sessions'

const SessionSchema = new mongoose.Schema<SessionFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	tutor: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	students: {
		type: [mongoose.Schema.Types.Mixed] as unknown as SessionFromModel['students'],
		required: true
	},
	paid: {
		type: [String],
		required: true
	},
	subjectId: {
		type: String,
		required: true
	},
	topic: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	attachments: {
		type: [mongoose.Schema.Types.Mixed] as unknown as SessionFromModel['attachments'],
		required: true
	},
	startedAt: {
		type: Number,
		required: true
	},
	endedAt: {
		type: Number,
		required: true
	},
	lengthInMinutes: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	ratings: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: {}
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	cancelled: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: null
	},
	closedAt: {
		type: Number,
		required: false,
		default: null
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { minimize: false })

export const Session = mongoose.model<SessionFromModel>('Session', SessionSchema)

generateChangeStreams<SessionFromModel, SessionEntity>(Session, SessionChangeStreamCallbacks, new SessionMapper().mapFrom).then()