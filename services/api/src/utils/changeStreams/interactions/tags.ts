import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { TagEntity, TagFromModel } from '@modules/interactions'
import { getSocketEmitter } from '@index'

export const TagChangeStreamCallbacks: ChangeStreamCallbacks<TagFromModel, TagEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('interactions/tags', after)
		await getSocketEmitter().emitCreated(`interactions/tags/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('interactions/tags', after)
		await getSocketEmitter().emitUpdated(`interactions/tags/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('interactions/tags', before)
		await getSocketEmitter().emitDeleted(`interactions/tags/${before.id}`, before)
	}
}