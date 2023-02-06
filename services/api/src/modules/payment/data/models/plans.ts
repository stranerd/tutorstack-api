import { Currencies, PlanData, PlanInterval } from '../../domain/types'

export interface PlanFromModel extends PlanToModel {
	createdAt: number
	updatedAt: number
}

export interface PlanToModel {
	_id: string
	amount: number
	currency: Currencies
	name: string
	interval: PlanInterval
	active: boolean
	data: PlanData
}