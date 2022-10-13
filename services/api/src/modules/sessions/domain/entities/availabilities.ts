import { Booked } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class AvailabilityEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly free: number[]
	public readonly booked: Booked[]
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, userId, free, booked, createdAt, updatedAt
	             }: AvailabilityConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.free = free
		this.booked = booked
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	static getLastHour (time: number) {
		const anHourInMs = 60 * 60 * 1000
		return Math.floor(time / anHourInMs) * anHourInMs
	}

	static getHoursBetween (from: number, to: number) {
		if (to <= from) return [from]
		const anHourInMs = 60 * 60 * 1000
		return new Array((to - from) / anHourInMs)
			.fill(0)
			.map((_, i) => (i * anHourInMs) + from)
	}

	isFreeBetween (from: number, to: number, checkOnlyBooked: boolean) {
		const hasNoBookedSession = this.booked.every((e) => from >= e.to || to <= e.from)
		const hourFrom = AvailabilityEntity.getLastHour(from)
		const hourTo = AvailabilityEntity.getLastHour(to)
		const hoursBetween = AvailabilityEntity.getHoursBetween(hourFrom, hourTo)
		const free = hoursBetween.every((hr) => this.free.includes(hr))
		return hasNoBookedSession && (checkOnlyBooked ? true : free)
	}
}

type AvailabilityConstructorArgs = {
	id: string
	userId: string
	free: number[]
	booked: Booked[]
	createdAt: number
	updatedAt: number
}