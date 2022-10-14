import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { AvailabilityEntity, AvailabilityFromModel } from '@modules/sessions'
import { getSocketEmitter } from '@index'

export const AvailabilityChangeStreamCallbacks: ChangeStreamCallbacks<AvailabilityFromModel, AvailabilityEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('sessions/availabilities', after)
		await getSocketEmitter().emitCreated(`sessions/availabilities/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('sessions/availabilities', after)
		await getSocketEmitter().emitUpdated(`sessions/availabilities/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('sessions/availabilities', before)
		await getSocketEmitter().emitDeleted(`sessions/availabilities/${before.id}`, before)
	}
}