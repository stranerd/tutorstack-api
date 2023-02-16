import { PlanDataType, WalletsUseCases } from '@modules/payment'
import { AnswersUseCases, QuestionEntity, QuestionFromModel } from '@modules/questions'
import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { holdQuestion, releaseQuestion } from '@utils/modules/questions/questions'
import { ChangeStreamCallbacks } from 'equipped'

export const QuestionChangeStreamCallbacks: ChangeStreamCallbacks<QuestionFromModel, QuestionEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('questions/questions', after)
		await appInstance.listener.created(`questions/questions/${after.id}`, after)

		await WalletsUseCases.updateSubscriptionData({ userId: after.user.id, key: PlanDataType.questions, value: -1 })

		await UsersUseCases.incrementMeta({ ids: [after.user.id], value: 1, property: UserMeta.questions })
	},
	updated: async ({ before, after, changes }) => {
		await appInstance.listener.updated('questions/questions', after)
		await appInstance.listener.updated(`questions/questions/${after.id}`, after)

		if (changes.attachment && before.attachment) await publishers.DELETEFILE.publish(before.attachment)
		if (changes.heldBy) await Promise.all([
			holdQuestion(after),
			before.heldBy && releaseQuestion(before.id, before.heldBy.userId)
		])
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('questions/questions', before)
		await appInstance.listener.deleted(`questions/questions/${before.id}`, before)

		await AnswersUseCases.deleteQuestionAnswers(before.id)

		await UsersUseCases.incrementMeta({ ids: [before.user.id], value: -1, property: UserMeta.questions })

		if (before.attachment) await publishers.DELETEFILE.publish(before.attachment)
	}
}