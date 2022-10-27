import {
	MethodsUseCases,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { BadRequestError, Request, validate, Validation } from '@stranerd/api-commons'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { cancelSubscription, subscribeToPlan } from '@utils/modules/payment/subscriptions'

export class WalletsController {
	static async get (req: Request) {
		return await WalletsUseCases.get(req.authUser!.id)
	}

	static async fund (req: Request) {
		const { methodId, amount } = validate({
			methodId: req.body.methodId,
			amount: req.body.amount
		}, {
			methodId: { required: true, rules: [Validation.isString] },
			amount: { required: true, rules: [Validation.isNumber, Validation.isMoreThanX(0)] }
		})

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
		const { planId } = validate({
			planId: req.body.planId
		}, {
			planId: { required: true, rules: [Validation.isString] }
		})

		return await subscribeToPlan(req.authUser!.id, planId)
	}

	static async cancelSubscription (req: Request) {
		return await cancelSubscription(req.authUser!.id)
	}
}