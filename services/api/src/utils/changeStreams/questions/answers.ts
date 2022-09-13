import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { AnswerEntity, AnswerFromModel, QuestionsUseCases } from '@modules/questions'
import { getSocketEmitter } from '@index'
import { UserMeta, UsersUseCases } from '@modules/users'
import { EventTypes, publishers } from '@utils/events'

export const AnswerChangeStreamCallbacks: ChangeStreamCallbacks<AnswerFromModel, AnswerEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('questions/answers', after)
		await getSocketEmitter().emitCreated(`questions/answers/${after.id}`, after)

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

		if (changes.best) await UsersUseCases.incrementMeta({
			id: before.user.id,
			value: after.best ? 1 : -1,
			property: UserMeta.bestAnswers
		})

		if (!after.best && changes.meta?.likes && after.meta.likes >= 20) {
			const question = await QuestionsUseCases.find(after.questionId)
			const markBest = question && !question.isAnswered && !question.answers.find((a) => a.id === after.id)
			if (markBest) await QuestionsUseCases.updateBestAnswer({
				id: question!.id,
				answerId: after.id,
				userId: question!.user.id,
				add: true
			})
		}

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

		if (before.best) {
			await UsersUseCases.incrementMeta({ id: before.user.id, value: -1, property: UserMeta.bestAnswers })
			const question = await QuestionsUseCases.find(before.questionId)
			if (question) await QuestionsUseCases.updateBestAnswer({
				id: question.id,
				userId: question.user.id,
				answerId: before.id,
				add: false
			})
		}
	}
}