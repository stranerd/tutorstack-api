import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { ViewEntity, ViewFromModel } from '@modules/interactions'
import { getSocketEmitter } from '@index'

export const ViewChangeStreamCallbacks: ChangeStreamCallbacks<ViewFromModel, ViewEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('interactions/views', after)
		await getSocketEmitter().emitCreated(`interactions/views/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('interactions/views', after)
		await getSocketEmitter().emitUpdated(`interactions/views/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('interactions/views', before)
		await getSocketEmitter().emitDeleted(`interactions/views/${before.id}`, before)
	}
}