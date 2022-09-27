import { EmbeddedUser, Media } from '../types'
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
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, tutor, students, paid, subjectId, topic, description, attachments,
		             startedAt, lengthInMinutes, createdAt, updatedAt
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
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get isPaid () {
		return this.students.every((s) => this.paid.includes(s.id))
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
	lengthInMinutes: number
	createdAt: number
	updatedAt: number
}