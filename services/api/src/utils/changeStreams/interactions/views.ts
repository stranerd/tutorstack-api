import { ViewEntity, ViewFromModel } from '@modules/interactions'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const ViewChangeStreamCallbacks: ChangeStreamCallbacks<ViewFromModel, ViewEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('interactions/views', after)
		await appInstance.listener.created(`interactions/views/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('interactions/views', after)
		await appInstance.listener.updated(`interactions/views/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('interactions/views', before)
		await appInstance.listener.deleted(`interactions/views/${before.id}`, before)
	}
}