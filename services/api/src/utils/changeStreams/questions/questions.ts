import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { AnswersUseCases, QuestionEntity, QuestionFromModel } from '@modules/questions'
import { UserMeta, UsersUseCases } from '@modules/users'
import { getSocketEmitter } from '@index'
import { EventTypes, publishers } from '@utils/events'

export const QuestionChangeStreamCallbacks: ChangeStreamCallbacks<QuestionFromModel, QuestionEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('questions/questions', after)
		await getSocketEmitter().emitCreated(`questions/questions/${after.id}`, after)

		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.questions })
	},
	updated: async ({ before, after, changes }) => {
		await getSocketEmitter().emitUpdated('questions/questions', after)
		await getSocketEmitter().emitUpdated(`questions/questions/${after.id}`, after)

		if (changes.attachment && before.attachment) await publishers[EventTypes.DELETEFILE].publish(before.attachment)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('questions/questions', before)
		await getSocketEmitter().emitDeleted(`questions/questions/${before.id}`, before)

		await AnswersUseCases.deleteQuestionAnswers(before.id)

		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.questions })

		if (before.attachment) await publishers[EventTypes.DELETEFILE].publish(before.attachment)
	}
}