import { CommentEntity, CommentFromModel, InteractionEntities } from '@modules/interactions'
import { QuestionMetaType, QuestionsUseCases } from '@modules/questions'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const CommentChangeStreamCallbacks: ChangeStreamCallbacks<CommentFromModel, CommentEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('interactions/comments', after)
		await appInstance.listener.created(`interactions/comments/${after.id}`, after)
		if (after.entity.type === InteractionEntities.questions) await QuestionsUseCases.updateMeta({
			id: after.entity.id,
			property: QuestionMetaType.comments,
			value: 1
		})
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('interactions/comments', after)
		await appInstance.listener.updated(`interactions/comments/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('interactions/comments', before)
		await appInstance.listener.deleted(`interactions/comments/${before.id}`, before)
		if (before.entity.type === InteractionEntities.questions) await QuestionsUseCases.updateMeta({
			id: before.entity.id,
			property: QuestionMetaType.comments,
			value: -1
		})
	}
}