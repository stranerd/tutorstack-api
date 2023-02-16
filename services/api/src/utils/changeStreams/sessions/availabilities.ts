import { AvailabilityEntity, AvailabilityFromModel } from '@modules/sessions'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const AvailabilityChangeStreamCallbacks: ChangeStreamCallbacks<AvailabilityFromModel, AvailabilityEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('sessions/availabilities', after)
		await appInstance.listener.created(`sessions/availabilities/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('sessions/availabilities', after)
		await appInstance.listener.updated(`sessions/availabilities/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('sessions/availabilities', before)
		await appInstance.listener.deleted(`sessions/availabilities/${before.id}`, before)
	}
}