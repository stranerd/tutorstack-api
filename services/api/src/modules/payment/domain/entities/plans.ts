import { BaseEntity, CronTypes } from '@stranerd/api-commons'
import { Currencies, PlanData } from '../types'

export class PlanEntity extends BaseEntity {
	public readonly id: string
	public readonly name: string
	public readonly interval: CronTypes
	public readonly active: boolean
	public readonly amount: number
	public readonly currency: Currencies
	public readonly data: PlanData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id,
		             amount,
		             currency,
		             name,
		             interval,
		             active,
		             data,
		             createdAt,
		             updatedAt
	             }: PlanConstructorArgs) {
		super()
		this.id = id
		this.name = name
		this.interval = interval
		this.active = active
		this.amount = amount
		this.currency = currency
		this.data = data
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getNextCharge (time: number) {
		const date = new Date(time)
		if (this.interval === CronTypes.secondly) date.setSeconds(date.getSeconds() + 1)
		if (this.interval === CronTypes.minutely) date.setMinutes(date.getMinutes() + 1)
		if (this.interval === CronTypes.hourly) date.setHours(date.getHours() + 1)
		if (this.interval === CronTypes.daily) date.setDate(date.getDate() + 1)
		if (this.interval === CronTypes.weekly) date.setDate(date.getDate() + 7)
		if (this.interval === CronTypes.monthly) date.setMonth(date.getMonth() + 1)
		if (this.interval === CronTypes.quarterly) date.setMonth(date.getMonth() + 3)
		if (this.interval === CronTypes.yearly) date.setFullYear(date.getFullYear() + 1)
		return date.getTime()
	}
}

type PlanConstructorArgs = {
	id: string
	name: string
	amount: number
	active: boolean
	currency: Currencies
	interval: CronTypes
	data: PlanData
	createdAt: number
	updatedAt: number
}