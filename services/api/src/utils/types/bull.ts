export enum DelayedJobs {
	HoldQuestion = 'HoldQuestion',
	CloseSession = 'CloseSession'
}

export type DelayedEvent = {
	type: DelayedJobs.HoldQuestion,
	data: { questionId: string, userId: string }
} | {
	type: DelayedJobs.CloseSession,
	data: { sessionId: string, tutorId: string }
}
