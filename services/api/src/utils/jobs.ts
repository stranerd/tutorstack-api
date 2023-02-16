import { EmailsUseCases, NotificationsUseCases } from '@modules/notifications'
import { MethodsUseCases } from '@modules/payment'
import { AvailabilitiesUseCases, SessionsUseCases } from '@modules/sessions'
import { appInstance } from '@utils/environment'
import { deleteUnverifiedUsers } from '@utils/modules/auth'
import { sendMailAndCatchError } from '@utils/modules/notifications/emails'
import { renewSubscription } from '@utils/modules/payment/subscriptions'
import { retryTransactions } from '@utils/modules/payment/transactions'
import { releaseQuestion } from '@utils/modules/questions/questions'
import { CronTypes, DelayedJobs } from 'equipped'

export const startJobs = async () => {
	await appInstance.job.startProcessingQueues([
		{ name: CronTypes.hourly, cron: '0 * * * *' },
		{ name: CronTypes.daily, cron: '0 0 * * *' },
		{ name: CronTypes.weekly, cron: '0 0 * * SUN' },
		{ name: CronTypes.monthly, cron: '0 0 1 * *' }
	], {
		onDelayed: async (data) => {
			if (data.type === DelayedJobs.HoldQuestion) await releaseQuestion(data.data.questionId, data.data.userId)
			if (data.type === DelayedJobs.CloseSession) await SessionsUseCases.close({
				id: data.data.sessionId,
				tutorId: data.data.tutorId
			})
			if (data.type === DelayedJobs.RenewSubscription) await renewSubscription(data.data.userId)
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
			if (type === CronTypes.monthly) await MethodsUseCases.markExpireds()
		}
	})
}