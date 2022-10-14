import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { ReviewEntity, ReviewFromModel } from '@modules/sessions'
import { getSocketEmitter } from '@index'

export const ReviewChangeStreamCallbacks: ChangeStreamCallbacks<ReviewFromModel, ReviewEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('sessions/reviews', after)
		await getSocketEmitter().emitCreated(`sessions/reviews/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('sessions/reviews', after)
		await getSocketEmitter().emitUpdated(`sessions/reviews/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('sessions/reviews', before)
		await getSocketEmitter().emitDeleted(`sessions/reviews/${before.id}`, before)
	}
}