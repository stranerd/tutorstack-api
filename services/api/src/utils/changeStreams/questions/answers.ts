import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { AnswerEntity, AnswerFromModel, QuestionsUseCases } from '@modules/questions'
import { getSocketEmitter } from '@index'
import { UserMeta, UsersUseCases } from '@modules/users'
import { EventTypes, publishers } from '@utils/events'
import { releaseQuestion } from '@utils/modules/questions/questions'

export const AnswerChangeStreamCallbacks: ChangeStreamCallbacks<AnswerFromModel, AnswerEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('questions/answers', after)
		await getSocketEmitter().emitCreated(`questions/answers/${after.id}`, after)

		await releaseQuestion(after.questionId, after.user.id)
		await UsersUseCases.incrementMeta({ id: after.user.id, value: 1, property: UserMeta.answers })
		await QuestionsUseCases.updateAnswers({
			questionId: after.questionId,
			answerId: after.id,
			userId: after.user.id,
			add: true
		})
	},
	updated: async ({ before, after, changes }) => {
		await getSocketEmitter().emitUpdated('questions/answers', after)
		await getSocketEmitter().emitUpdated(`questions/answers/${after.id}`, after)

		if (changes.attachment) await publishers[EventTypes.DELETEFILE].publish(before.attachment)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('questions/answers', before)
		await getSocketEmitter().emitDeleted(`questions/answers/${before.id}`, before)

		await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.answers })
		await QuestionsUseCases.updateAnswers({
			questionId: before.questionId,
			answerId: before.id,
			userId: before.user.id,
			add: false
		})

		await publishers[EventTypes.DELETEFILE].publish(before.attachment)
	}
}