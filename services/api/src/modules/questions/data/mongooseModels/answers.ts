import { AnswerDbChangeCallbacks } from '@utils/changeStreams/questions/answers'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { AnswerEntity } from '../../domain/entities/answers'
import { AnswerMapper } from '../mappers/answers'
import { AnswerFromModel } from '../models/answers'

const Schema = new mongoose.Schema<AnswerFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	questionId: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.Mixed as unknown as AnswerFromModel['user'],
		required: true
	},
	attachment: {
		type: mongoose.Schema.Types.Mixed as unknown as AnswerFromModel['attachment'],
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

export const Answer = mongoose.model<AnswerFromModel>('QuestionsAnswer', Schema)

export const AnswerChange = appInstance.db
	.generateDbChange<AnswerFromModel, AnswerEntity>(Answer, AnswerDbChangeCallbacks, new AnswerMapper().mapFrom)
