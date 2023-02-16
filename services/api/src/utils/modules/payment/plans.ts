import { Currencies, PlanToModel } from '@modules/payment'
import { CronTypes } from 'equipped'

export const plansList: PlanToModel[] = [
	{
		_id: 'premium-plan',
		amount: 9.99,
		currency: Currencies.USD,
		name: 'Premium',
		interval: CronTypes.monthly,
		data: { questions: 5, recordings: 1 },
		active: true
	}
]