import { ErrorEntity, ErrorFromModel } from '@modules/notifications'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const ErrorChangeStreamCallbacks: ChangeStreamCallbacks<ErrorFromModel, ErrorEntity> = {
	created: async ({ after }) => {
		await appInstance.logger.error(after.error)
	}
}