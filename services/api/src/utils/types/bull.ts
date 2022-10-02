export enum DelayedJobs {
	HoldQuestion = 'HoldQuestion'
}

export type DelayedEvent = {
	type: DelayedJobs.HoldQuestion,
	data: { questionId: string, userId: string }
}
