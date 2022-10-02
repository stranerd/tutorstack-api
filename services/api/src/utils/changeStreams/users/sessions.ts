import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { SessionEntity, SessionFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'

export const SessionChangeStreamCallbacks: ChangeStreamCallbacks<SessionFromModel, SessionEntity> = {
	created: async ({ after }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitCreated(`users/sessions/${id}`, after)
				await getSocketEmitter().emitCreated(`users/sessions/${id}/${after.id}`, after)
			})
		)
	},
	updated: async ({ after }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitUpdated(`users/sessions/${id}`, after)
				await getSocketEmitter().emitUpdated(`users/sessions/${id}/${after.id}`, after)
			})
		)
	},
	deleted: async ({ before }) => {
		await Promise.all(
			before.getParticipants().map(async (id) => {
				await getSocketEmitter().emitDeleted(`users/sessions/${id}`, before)
				await getSocketEmitter().emitDeleted(`users/sessions/${id}/${before.id}`, before)
			})
		)
	}
}