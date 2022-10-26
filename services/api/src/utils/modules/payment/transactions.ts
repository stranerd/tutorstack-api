import {
	Currencies,
	TransactionEntity,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { Conditions } from '@stranerd/api-commons'
import { SessionsUseCases } from '@modules/sessions'
import { BraintreePayment } from '@utils/modules/payment/braintree'

export const fulfillTransaction = async (transaction: TransactionEntity) => {
	if (transaction.data.type === TransactionType.PayForSession) {
		const { sessionId, userId } = transaction.data
		await SessionsUseCases.updatePaid({ id: sessionId, userId, add: true })
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
	} else if (transaction.data.type === TransactionType.RefundSession) {
		await WalletsUseCases.updateAmount({
			userId: transaction.userId,
			amount: await BraintreePayment.convertAmount(transaction.amount, transaction.currency, Currencies.USD)
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
	} else if (transaction.data.type === TransactionType.ReceiveSessionPayment) {
		await WalletsUseCases.updateAmount({
			userId: transaction.userId,
			amount: await BraintreePayment.convertAmount(transaction.amount, transaction.currency, Currencies.USD)
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
	} else if (transaction.data.type === TransactionType.FundWallet) {
		await WalletsUseCases.updateAmount({
			userId: transaction.userId,
			amount: await BraintreePayment.convertAmount(transaction.amount, transaction.currency, Currencies.USD)
		})
		await TransactionsUseCases.update({
			id: transaction.id,
			data: { status: TransactionStatus.settled }
		})
	}
}

export const retryTransactions = async (timeInMs: number) => {
	const { results: fulfilledTransactions } = await TransactionsUseCases.get({
		where: [{ field: 'status', value: TransactionStatus.fulfilled },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }],
		all: true
	})
	await Promise.all(fulfilledTransactions.map(fulfillTransaction))

	const { results: initializedTransactions } = await TransactionsUseCases.get({
		where: [{ field: 'status', value: TransactionStatus.initialized },
			{ field: 'createdAt', condition: Conditions.gt, value: Date.now() - timeInMs }],
		all: true
	})
	await TransactionsUseCases.delete(initializedTransactions.map((t) => t.id))
}