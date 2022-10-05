import { CronTypes } from '@stranerd/api-commons'
import { appInstance } from '@utils/environment'
import { EmailsUseCases, NotificationsUseCases } from '@modules/notifications'
import { sendMailAndCatchError } from '@utils/modules/notifications/emails'
import { DelayedEvent, DelayedJobs } from '@utils/types'
import { deleteUnverifiedUsers } from '@utils/modules/auth'
import { retryTransactions } from '@utils/modules/payment/transactions'
import { CardsUseCases } from '@modules/payment'
import { releaseQuestion } from '@utils/modules/questions/questions'
import { AvailabilitiesUseCases } from '@modules/sessions'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues<DelayedEvent, any>([
		{ name: CronTypes.hourly, cron: '0 * * * *' },
		{ name: CronTypes.daily, cron: '0 0 * * *' },
		{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
		{ name: CronTypes.monthly, cron: '0 0 1 * *' }
	], {
		onDelayed: async (data) => {
			if (data.type === DelayedJobs.HoldQuestion) await releaseQuestion(data.data.questionId, data.data.userId)
		},
		onCronLike: async () => {
		},
		onCron: async (type) => {
			if (type === CronTypes.hourly) {
				const errors = await EmailsUseCases.getAndDeleteAllErrors()
				await Promise.all(errors.map((e) => sendMailAndCatchError(e as any)))
				await retryTransactions(60 * 60 * 1000)
				await appInstance.job.retryAllFailedJobs()
			}
			if (type === CronTypes.daily) await Promise.all([
				deleteUnverifiedUsers(), AvailabilitiesUseCases.removeOld()
			])
			if (type === CronTypes.weekly) await NotificationsUseCases.deleteOldSeen()
			if (type === CronTypes.monthly) await CardsUseCases.markExpireds()
		}
	})
}