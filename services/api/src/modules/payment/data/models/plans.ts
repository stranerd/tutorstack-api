import { Currencies, PlanData, PlanFeatures } from '../../domain/types'
import { CronTypes } from '@stranerd/api-commons'

export interface PlanFromModel extends PlanToModel {
	createdAt: number
	updatedAt: number
}

export interface PlanToModel {
	_id: string
	amount: number
	currency: Currencies
	name: string
	interval: CronTypes
	active: boolean
	data: PlanData
	features: PlanFeatures
}