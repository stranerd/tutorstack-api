import { ErrorEntity, ErrorFromModel } from '@modules/notifications'
import { appInstance } from '@utils/environment'
import { DbChangeCallbacks } from 'equipped'

export const ErrorDbChangeCallbacks: DbChangeCallbacks<ErrorFromModel, ErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	}
}