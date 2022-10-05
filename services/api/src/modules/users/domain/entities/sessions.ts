import { Currencies, EmbeddedUser, Media } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class SessionEntity extends BaseEntity {
	public readonly id: string
	public readonly tutor: EmbeddedUser
	public readonly students: EmbeddedUser[]
	public readonly paid: string[]
	public readonly subjectId: string
	public readonly topic: string
	public readonly description: string
	public readonly attachments: Media[]
	public readonly startedAt: number
	public readonly lengthInMinutes: number
	public readonly price: number
	public readonly currency: Currencies
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, tutor, students, paid, subjectId, topic, description, attachments,
		             startedAt, lengthInMinutes, price, currency, createdAt, updatedAt
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
		this.lengthInMinutes = lengthInMinutes
		this.price = price
		this.currency = currency
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getParticipants () {
		return this.students.map((s) => s.id).concat(this.tutor.id)
	}

	static lengthsInMinutes = [60, 120, 180]
	static maxMembers = 5

	static getPrice (lengthInMinutes: number, members: number) {
		const lengthInHours = lengthInMinutes / 60
		const baseAmount = 25
		const discounts = { 1: 1, 2: 0.7, 3: 0.6, 4: 0.55, 5: 0.52 }
		return lengthInHours * baseAmount * (discounts[members] ?? 1)
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
	lengthInMinutes: number
	price: number
	currency: Currencies
	createdAt: number
	updatedAt: number
}