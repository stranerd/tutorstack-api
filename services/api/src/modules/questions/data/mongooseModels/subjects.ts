import { SubjectDbChangeCallbacks } from '@utils/changeStreams/questions/subjects'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { SubjectEntity } from '../../domain/entities/subjects'
import { SubjectMapper } from '../mappers/subjects'
import { SubjectFromModel } from '../models/subjects'

const Schema = new mongoose.Schema<SubjectFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	title: {
		type: String,
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

export const Subject = mongoose.model<SubjectFromModel>('QuestionsSubject', Schema)

export const SubjectChange = appInstance.db
	.generateDbChange<SubjectFromModel, SubjectEntity>(Subject, SubjectDbChangeCallbacks, new SubjectMapper().mapFrom)
