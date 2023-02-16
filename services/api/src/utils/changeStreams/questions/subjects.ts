import { QuestionsUseCases, SubjectEntity, SubjectFromModel } from '@modules/questions'
import { UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const SubjectChangeStreamCallbacks: ChangeStreamCallbacks<SubjectFromModel, SubjectEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('questions/subjects', after)
		await appInstance.listener.created(`questions/subjects/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('questions/subjects', after)
		await appInstance.listener.updated(`questions/subjects/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('questions/subjects', before)
		await appInstance.listener.deleted(`questions/subjects/${before.id}`, before)
		await UsersUseCases.removeSavedSubjects(before.id)
		await QuestionsUseCases.deleteSubjectQuestions(before.id)
	}
}