import { BaseEntity } from 'equipped'
import { Currencies, EmbeddedUser, Media, SessionCancelled } from '../types'

export class SessionEntity extends BaseEntity {
	static lengthsInMinutes = [60, 120, 180]
	static maxMembers = 5
	public readonly id: string
	public readonly tutor: EmbeddedUser
	public readonly students: EmbeddedUser[]
	public readonly paid: string[]
	public readonly subjectId: string
	public readonly topic: string
	public readonly description: string
	public readonly attachments: Media[]
	public readonly startedAt: number
	public readonly endedAt: number
	public readonly lengthInMinutes: number
	public readonly price: number
	public readonly currency: Currencies
	public readonly ratings: Record<string, string>
	public readonly cancelled: SessionCancelled | null
	public readonly closedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, tutor, students, paid, subjectId, topic, description, attachments,
		startedAt, closedAt, lengthInMinutes, price, currency, ratings,
		cancelled, endedAt, createdAt, updatedAt
	}: SessionConstructorArgs) {
		super()
		this.id = id
		this.tutor = tutor
		this.students = students
		this.paid = paid
		this.subjectId = subjectId
		this.topic = topic
		this.description = description
		this.attachments = attachments
		this.startedAt = startedAt
		this.endedAt = endedAt
		this.lengthInMinutes = lengthInMinutes
		this.price = price
		this.currency = currency
		this.ratings = ratings
		this.cancelled = cancelled
		this.closedAt = closedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	static getPrice (lengthInMinutes: number, members: number) {
		const lengthInHours = lengthInMinutes / 60
		const baseAmount = 25
		const discounts = { 1: 1, 2: 0.7, 3: 0.6, 4: 0.55, 5: 0.52 }
		return lengthInHours * baseAmount * (discounts[members] ?? 1)
	}

	getParticipants () {
		return this.students.map((s) => s.id).concat(this.tutor.id)
	}
}

type SessionConstructorArgs = {
	id: string
	tutor: EmbeddedUser
	students: EmbeddedUser[]
	paid: string[]
	subjectId: string
	topic: string
	description: string
	attachments: Media[]
	startedAt: number
	endedAt: number
	lengthInMinutes: number
	price: number
	currency: Currencies
	ratings: Record<string, string>
	cancelled: SessionCancelled | null
	closedAt: number | null
	createdAt: number
	updatedAt: number
}