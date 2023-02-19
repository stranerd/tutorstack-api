import { EducationEntity, EducationFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'

export const EducationDbChangeCallbacks: DbChangeCallbacks<EducationFromModel, EducationEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('users/educations', after)
		await appInstance.listener.created(`users/educations/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated('users/educations', after)
		await appInstance.listener.updated(`users/educations/${after.id}`, after)

		if (changes.verification) await publishers.DELETEFILE.publish(before.verification)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/educations', before)
		await appInstance.listener.deleted(`users/educations/${before.id}`, before)

		await publishers.DELETEFILE.publish(before.verification)
	}
}