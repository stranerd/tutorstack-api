import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { CommentEntity, CommentFromModel, InteractionEntities } from '@modules/interactions'
import { getSocketEmitter } from '@index'
import { QuestionMetaType, QuestionsUseCases } from '@modules/questions'

export const CommentChangeStreamCallbacks: ChangeStreamCallbacks<CommentFromModel, CommentEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('interactions/comments', after)
		await getSocketEmitter().emitCreated(`interactions/comments/${after.id}`, after)
		if (after.entity.type === InteractionEntities.questions) await QuestionsUseCases.updateMeta({
			id: after.entity.id,
			property: QuestionMetaType.comments,
			value: 1
		})
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('interactions/comments', after)
		await getSocketEmitter().emitUpdated(`interactions/comments/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('interactions/comments', before)
		await getSocketEmitter().emitDeleted(`interactions/comments/${before.id}`, before)
		if (before.entity.type === InteractionEntities.questions) await QuestionsUseCases.updateMeta({
			id: before.entity.id,
			property: QuestionMetaType.comments,
			value: -1
		})
	}
}