import {
	MethodEntity,
	MethodsUseCases,
	PlanEntity,
	PlansUseCases,
	TransactionStatus,
	TransactionsUseCases,
	TransactionType,
	WalletsUseCases
} from '@modules/payment'
import { UserEntity, UsersUseCases } from '@modules/users'
import { BraintreePayment } from '@utils/modules/payment/braintree'
import { BadRequestError, DelayedJobs } from '@stranerd/api-commons'
import { appInstance } from '@utils/environment'

const activateSub = async (userId: string, walletId: string, subscription: PlanEntity, successful: boolean) => {
	const now = Date.now()
	const renewedAt = subscription.getNextCharge(now)
	const jobId = await appInstance.job.addDelayedJob({
		type: DelayedJobs.RenewSubscription, data: { userId }
	}, renewedAt - now)
	return await WalletsUseCases.updateSubscription({
		id: walletId,
		data: {
			active: successful,
			current: successful ? { id: subscription.id, activatedAt: now, expiredAt: renewedAt, jobId } : null,
			next: successful ? { id: subscription.id, renewedAt } : null,
			...(successful ? { data: subscription.data } : {})
		}
	})
}

const chargeForSubscription = async (user: UserEntity, subscription: PlanEntity, method: MethodEntity) => {
	const transaction = await TransactionsUseCases.create({
		userId: user.id, email: user.bio.email, amount: 0 - subscription.amount, currency: subscription.currency,
		status: TransactionStatus.initialized, title: `Subscription charge for ${subscription.name}`,
		data: { type: TransactionType.Subscription, subscriptionId: subscription.id }
	})
	const successful = await BraintreePayment.charge({
		amount: Math.abs(transaction.amount),
		currency: transaction.currency,
		token: method.token
	})
	await TransactionsUseCases.update({
		id: transaction.id,
		data: { status: successful ? TransactionStatus.settled : TransactionStatus.failed }
	})
	return successful
}

const deactivateSub = async (walletId: string) => await WalletsUseCases.updateSubscription({
	id: walletId, data: { active: false, next: null }
})

export const subscribeToPlan = async (userId: string, subscriptionId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	if (wallet.subscription.active) return wallet
	const user = await UsersUseCases.find(userId)
	if (!user) throw new BadRequestError('profile not found')
	const subscription = await PlansUseCases.find(subscriptionId)
	if (!subscription) throw new BadRequestError('subscription not found')
	if (!subscription.active) throw new BadRequestError('you cant subscribe to this plan currently')
	const { results: methods } = await MethodsUseCases.get({
		where: [{ field: 'userId', value: userId }, { field: 'primary', value: true }]
	})
	const method = methods.at(0)
	if (!method) throw new BadRequestError('no method found')
	const successful = await chargeForSubscription(user, subscription, method)
	if (!successful) throw new BadRequestError('charge failed')
	return activateSub(userId, wallet.id, subscription, successful)
}

export const renewSubscription = async (userId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	if (!wallet.subscription.next) return await deactivateSub(wallet.id)
	const user = await UsersUseCases.find(userId)
	if (!user) return await deactivateSub(wallet.id)
	const subscription = await PlansUseCases.find(wallet.subscription.next.id)
	if (!subscription || !subscription.active) return await deactivateSub(wallet.id)
	const { results: methods } = await MethodsUseCases.get({
		where: [{ field: 'userId', value: userId }, { field: 'primary', value: true }]
	})
	const method = methods.at(0)
	if (!method) return await deactivateSub(wallet.id)
	const successful = await chargeForSubscription(user, subscription, method)
	return successful ? activateSub(userId, wallet.id, subscription, successful) : await deactivateSub(wallet.id)
}

export const cancelSubscription = async (userId: string) => {
	const wallet = await WalletsUseCases.get(userId)
	return await WalletsUseCases.updateSubscription({
		id: wallet.id, data: { next: null }
	})
}