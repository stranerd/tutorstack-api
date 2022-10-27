export enum DelayedJobs {
	HoldQuestion = 'HoldQuestion',
	CloseSession = 'CloseSession',
	RenewSubscription = 'RenewSubscription'
}

export type DelayedEvent = {
	type: DelayedJobs.HoldQuestion,
	data: { questionId: string, userId: string }
} | {
	type: DelayedJobs.CloseSession,
	data: { sessionId: string, tutorId: string }
} | {
	type: typeof DelayedJobs.RenewSubscription,
	data: { userId: string }
}
