import {
	MethodsUseCases,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { cancelSubscription, subscribeToPlan } from '@utils/modules/payment/subscriptions'
import { BadRequestError, Request, Schema, validateReq } from 'equipped'

export class WalletsController {
	static async get (req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async fund (req: Request) {
		const { methodId, amount } = validateReq({
			methodId: Schema.string().min(1),
			amount: Schema.number().gt(0)
		}, req.body)

		const email = req.authUser!.email
		const userId = req.authUser!.id
		const method = await MethodsUseCases.find(methodId)
		if (!method || method.userId !== userId) throw new BadRequestError('invalid method')

		const wallet = await WalletsUseCases.get(req.authUser!.id)
		const successful = await BraintreePayment.charge({
			token: method.token, amount, currency: wallet.balance.currency
		})

		await TransactionsUseCases.create({
			email, userId, status: successful ? TransactionStatus.fulfilled : TransactionStatus.failed,
			title: 'Funded wallet', amount, currency: wallet.balance.currency,
			data: { type: TransactionType.FundWallet }
		})

		return successful
	}

	static async subscribeToPlan (req: Request) {
		const { planId } = validateReq({
			planId: Schema.string()
		}, req.body)

		return await subscribeToPlan(req.authUser!.id, planId)
	}

	static async cancelSubscription (req: Request) {
		return await cancelSubscription(req.authUser!.id)
	}
}