import { NotificationType } from '@modules/notifications'
import { AnswerEntity, AnswerFromModel, QuestionsUseCases } from '@modules/questions'
import { UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { sendNotification } from '@utils/modules/notifications/notifications'
import { releaseQuestion } from '@utils/modules/questions/questions'
import { ChangeStreamCallbacks, Validation } from 'equipped'

export const AnswerChangeStreamCallbacks: ChangeStreamCallbacks<AnswerFromModel, AnswerEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('questions/answers', after)
		await appInstance.listener.created(`questions/answers/${after.id}`, after)

		await releaseQuestion(after.questionId, after.user.id)

		const question = await QuestionsUseCases.find(after.questionId)
		if (question) await sendNotification([question.user.id], {
			title: `${question.user.bio.name.full} answered your question`,
			body: Validation.stripHTML(question.body),
			data: { type: NotificationType.NewAnswer, questionId: after.questionId, answerId: after.id },
			sendEmail: true
		})

		await UsersUseCases.incrementMeta({ ids: [after.user.id], value: 1, property: UserMeta.answers })
		await QuestionsUseCases.updateAnswers({
			questionId: after.questionId,
			answerId: after.id,
			userId: after.user.id,
			add: true
		})
	},
	updated: async ({ before, after, changes }) => {
		await appInstance.listener.updated('questions/answers', after)
		await appInstance.listener.updated(`questions/answers/${after.id}`, after)

		if (changes.attachment) await publishers.DELETEFILE.publish(before.attachment)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('questions/answers', before)
		await appInstance.listener.deleted(`questions/answers/${before.id}`, before)

		await UsersUseCases.incrementMeta({ ids: [before.user.id], value: -1, property: UserMeta.answers })
		await QuestionsUseCases.updateAnswers({
			questionId: before.questionId,
			answerId: before.id,
			userId: before.user.id,
			add: false
		})

		await publishers.DELETEFILE.publish(before.attachment)
	}
}