import { QuestionEntity, QuestionsUseCases } from '@modules/questions'
import { DelayedJobs } from '@stranerd/api-commons'
import { appInstance } from '@utils/environment'

export const holdQuestion = async (question: QuestionEntity) => {
	if (!question.heldBy) return
	await appInstance.job.addDelayedJob({
		type: DelayedJobs.HoldQuestion,
		data: { questionId: question.id, userId: question.heldBy.userId }
	}, question.heldBy.releasedAt)
}

export const releaseQuestion = async (questionId: string, userId: string) => {
	await QuestionsUseCases.hold({ id: questionId, userId, hold: false })
}