import { SessionEntity } from '@modules/sessions'
import { TransactionStatus, TransactionsUseCases, TransactionType } from '@modules/payment'

export const payTutorForSession = async (session: SessionEntity) => {
	const amount = session.paid.length * session.price
	const finalAmount = 0.8 * amount
	await TransactionsUseCases.create({
		userId: session.tutor.id, email: session.tutor.bio.email,
		title: `You received payment for session: ${session.id}`,
		amount: finalAmount, currency: session.currency,
		status: TransactionStatus.fulfilled,
		data: { type: TransactionType.ReceiveSessionPayment, sessionId: session.id }
	})
}