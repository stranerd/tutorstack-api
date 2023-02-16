import { TagEntity, TagFromModel } from '@modules/interactions'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const TagChangeStreamCallbacks: ChangeStreamCallbacks<TagFromModel, TagEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('interactions/tags', after)
		await appInstance.listener.created(`interactions/tags/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('interactions/tags', after)
		await appInstance.listener.updated(`interactions/tags/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('interactions/tags', before)
		await appInstance.listener.deleted(`interactions/tags/${before.id}`, before)
	}
}