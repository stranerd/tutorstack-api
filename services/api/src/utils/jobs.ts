import { CronTypes } from '@stranerd/api-commons'
import { appInstance } from '@utils/environment'
import { EmailsUseCases, NotificationsUseCases } from '@modules/notifications'
import { sendMailAndCatchError } from '@utils/modules/notifications/emails'
import { TypedEmail } from '@utils/types/email'
import { deleteUnverifiedUsers } from '@utils/modules/auth'
import { DelayedEvent } from '@utils/types/bull'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues<DelayedEvent, any>([
		{ name: CronTypes.hourly, cron: '0 * * * *' },
		{ name: CronTypes.daily, cron: '0 0 * * *' },
		{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
		{ name: CronTypes.monthly, cron: '0 0 1 * *' }
	], {
		onDelayed: async () => {
		},
		onCronLike: async () => {
		},
		onCron: async (type) => {
			if (type === CronTypes.hourly) {
				const errors = await EmailsUseCases.getAndDeleteAllErrors()
				await Promise.all(
					errors.map(async (error) => {
						await sendMailAndCatchError(error as unknown as TypedEmail)
					})
				)
				await appInstance.job.retryAllFailedJobs()
			}
			if (type === CronTypes.daily) await deleteUnverifiedUsers()
			if (type === CronTypes.weekly) await NotificationsUseCases.deleteOldSeen()
		}
	})
}