import { QuestionMetaType } from '@modules/questions/domain/types'
import { QuestionDbChangeCallbacks } from '@utils/changeStreams/questions/questions'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { QuestionEntity } from '../../domain/entities/questions'
import { QuestionMapper } from '../mappers/questions'
import { QuestionFromModel } from '../models/questions'

const Schema = new mongoose.Schema<QuestionFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	body: {
		type: String,
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
	user: {
		type: mongoose.Schema.Types.Mixed as unknown as QuestionFromModel['user'],
		required: true
	},
	answers: {
		type: [Object as unknown as any],
		required: false,
		default: []
	},
	attachment: {
		type: mongoose.Schema.Types.Mixed as unknown as QuestionFromModel['attachment'],
		required: false,
		default: null
	},
	heldBy: {
		type: mongoose.Schema.Types.Mixed as unknown as QuestionFromModel['heldBy'],
		required: false,
		default: null
	},
	meta: Object.fromEntries(
		Object.keys(QuestionMetaType).map((key) => [key, {
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

export const Question = mongoose.model<QuestionFromModel>('Question', Schema)

export const QuestionChange = appInstance.db
	.generateDbChange<QuestionFromModel, QuestionEntity>(Question, QuestionDbChangeCallbacks, new QuestionMapper().mapFrom)