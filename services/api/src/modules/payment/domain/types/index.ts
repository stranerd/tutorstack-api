export enum Currencies {
	USD = 'USD'
}

export enum CurrencyCountries {
	US = 'US'
}

export type SubscriptionModel = {
	active: boolean
	current: {
		id: string
		activatedAt: number
		expiredAt: number
		jobId: string
	} | null
	next: {
		id: string
		renewedAt: number
	} | null
	data: PlanData
}

export enum PlanDataType {
	questions = 'questions',
	recordings = 'recordings'
}

export type PlanData = Record<PlanDataType, number>

export enum TransactionStatus {
	initialized = 'initialized',
	fulfilled = 'fulfilled',
	failed = 'failed',
	settled = 'settled'
}

export enum TransactionType {
	PayForSession = 'PayForSession',
	RefundSession = 'RefundSession',
	ReceiveSessionPayment = 'ReceiveSessionPayment',
	FundWallet = 'FundWallet',
	Subscription = 'Subscription'
}

export type TransactionData = {
	type: TransactionType.PayForSession,
	sessionId: string,
	userId: string
} | {
	type: TransactionType.RefundSession,
	sessionId: string
} | {
	type: TransactionType.ReceiveSessionPayment,
	sessionId: string
} | {
	type: TransactionType.FundWallet
} | {
	type: TransactionType.Subscription,
	subscriptionId: string
}

export type AccountDetails = {
	country: CurrencyCountries
	number: string
	bankCode: string
	bankName: string
}

export enum MethodType {
	Card = 'Card',
	Paypal = 'Paypal'
}

export type MethodData = {
	type: MethodType.Paypal
	email: string
} | {
	type: MethodType.Card
	last4Digits: string
	country: string
	cardType: string
	expiredAt: number
	expired: boolean
}