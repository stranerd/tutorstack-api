import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { SessionEntity, SessionFromModel, SessionsUseCases } from '@modules/sessions'
import { getSocketEmitter } from '@index'
import { UserMeta, UsersUseCases } from '@modules/users'
import { TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'
import { appInstance } from '@utils/environment'
import { DelayedEvent, DelayedJobs } from '@utils/types'
import { Ms100Live } from '@utils/modules/sessions/100ms'

export const SessionChangeStreamCallbacks: ChangeStreamCallbacks<SessionFromModel, SessionEntity> = {
	created: async ({ after }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitCreated(`sessions/sessions/${id}`, after)
				await getSocketEmitter().emitCreated(`sessions/sessions/${id}/${after.id}`, after)
			})
		)
		const delay = after.endedAt - Date.now() + (10 * 60 * 1000)
		if (delay > 0) await appInstance.job.addDelayedJob<DelayedEvent>({
			type: DelayedJobs.CloseSession,
			data: { sessionId: after.id, tutorId: after.tutor.id }
		}, delay)
		else if (!after.closedAt) await SessionsUseCases.close({ id: after.id, tutorId: after.tutor.id })
	},
	updated: async ({ after, before, changes }) => {
		await Promise.all(
			after.getParticipants().map(async (id) => {
				await getSocketEmitter().emitUpdated(`sessions/sessions/${id}`, after)
				await getSocketEmitter().emitUpdated(`sessions/sessions/${id}/${after.id}`, after)
			})
		)

		if (changes.cancelled && after.cancelled) await Promise.all(after.paid.map(async (id) => {
			const user = after.students.find((u) => u.id === id)
			if (!user) return
			await TransactionsUseCases.create({
				userId: user.id, email: user.bio.email,
				title: `Refund for session: ${after.id}`,
				amount: after.price, currency: after.currency,
				status: TransactionStatus.fulfilled,
				data: { type: TransactionType.RefundSession, sessionId: after.id }
			})
		}))

		if (changes.closedAt && !before.closedAt && after.closedAt && !after.cancelled) await Promise.all([
			await TransactionsUseCases.create({
				userId: after.tutor.id, email: after.tutor.bio.email,
				title: `You received payment for session: ${after.id}`,
				amount: after.price, currency: after.currency,
				status: TransactionStatus.fulfilled,
				data: { type: TransactionType.ReceiveSessionPayment, sessionId: after.id }
			}),
			UsersUseCases.incrementMeta({
				ids: after.students.map((s) => s.id),
				value: 1,
				property: UserMeta.sessionsAttended
			}),
			UsersUseCases.incrementMeta({
				ids: [after.tutor.id],
				value: 1,
				property: UserMeta.sessionsHosted
			}),
			await Ms100Live.endRoom(after.id)
		])
	},
	deleted: async ({ before }) => {
		await Promise.all(
			before.getParticipants().map(async (id) => {
				await getSocketEmitter().emitDeleted(`sessions/sessions/${id}`, before)
				await getSocketEmitter().emitDeleted(`sessions/sessions/${id}/${before.id}`, before)
			})
		)
		if (before.closedAt && !before.cancelled) await Promise.all([
			UsersUseCases.incrementMeta({
				ids: before.students.map((s) => s.id),
				value: -1,
				property: UserMeta.sessionsAttended
			}),
			UsersUseCases.incrementMeta({
				ids: [before.tutor.id],
				value: -1,
				property: UserMeta.sessionsHosted
			})
		])
	}
}