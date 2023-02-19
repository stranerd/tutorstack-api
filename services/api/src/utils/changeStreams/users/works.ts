import { WorkEntity, WorkFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'

export const WorkDbChangeCallbacks: DbChangeCallbacks<WorkFromModel, WorkEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('users/works', after)
		await appInstance.listener.created(`users/works/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated('users/works', after)
		await appInstance.listener.updated(`users/works/${after.id}`, after)

		if (changes.verification) await publishers.DELETEFILE.publish(before.verification)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/works', before)
		await appInstance.listener.deleted(`users/works/${before.id}`, before)

		await publishers.DELETEFILE.publish(before.verification)
	}
}