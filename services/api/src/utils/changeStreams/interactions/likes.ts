import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { LikeEntity, LikeFromModel } from '@modules/interactions'
import { getSocketEmitter } from '@index'

export const LikeChangeStreamCallbacks: ChangeStreamCallbacks<LikeFromModel, LikeEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('interactions/likes', after)
		await getSocketEmitter().emitCreated(`interactions/likes/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('interactions/likes', after)
		await getSocketEmitter().emitUpdated(`interactions/likes/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('interactions/likes', before)
		await getSocketEmitter().emitDeleted(`interactions/likes/${before.id}`, before)
	}
}