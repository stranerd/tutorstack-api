import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { PlanEntity, PlanFromModel } from '@modules/payment'
import { getSocketEmitter } from '@index'

export const PlanChangeStreamCallbacks: ChangeStreamCallbacks<PlanFromModel, PlanEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('payment/plans', after)
		await getSocketEmitter().emitCreated(`payment/plans/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await getSocketEmitter().emitUpdated('payment/plans', after)
		await getSocketEmitter().emitUpdated(`payment/plans/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('payment/plans', before)
		await getSocketEmitter().emitDeleted(`payment/plans/${before.id}`, before)
	}
}