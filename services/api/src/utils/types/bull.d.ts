import { DelayedJobs } from 'equipped'

declare module 'equipped/lib/bull' {
	interface DelayedJobEvents {
		[DelayedJobs.HoldQuestion]: {
			type: typeof DelayedJobs.HoldQuestion,
			data: { questionId: string, userId: string }
		},
		[DelayedJobs.CloseSession]: {
			type: typeof DelayedJobs.CloseSession,
			data: { sessionId: string, tutorId: string }
		},
		[DelayedJobs.RenewSubscription]: {
			type: typeof DelayedJobs.RenewSubscription,
			data: { userId: string }
		}
	}

	interface CronLikeJobEvents { }
}