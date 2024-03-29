import { generateDefaultUser } from '@modules/users'
import { BaseEntity } from 'equipped'
import { EmbeddedUser, MAX_ANSWERS_COUNT, Media, QuestionHeld, QuestionMeta } from '../types'

export class QuestionEntity extends BaseEntity {
	public readonly id: string
	public readonly body: string
	public readonly attachment: Media | null
	public readonly subjectId: string
	public readonly topic: string
	public readonly user: EmbeddedUser
	public readonly answers: { id: string, userId: string }[]
	public readonly heldBy: QuestionHeld
	public readonly meta: QuestionMeta
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		id, body, subjectId, topic, attachment,
		createdAt, user, answers, heldBy, meta, updatedAt
	}: QuestionConstructorArgs) {
		super()
		this.id = id
		this.body = body
		this.attachment = attachment
		this.subjectId = subjectId
		this.topic = topic
		this.user = generateDefaultUser(user)
		this.answers = answers
		this.heldBy = heldBy
		this.meta = meta
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	isAnswered () {
		return this.answers.length >= MAX_ANSWERS_COUNT
	}

	isHeldBy (userId: string) {
		return this.heldBy?.userId === userId
	}
}

type QuestionConstructorArgs = {
	id: string
	body: string
	attachment: Media | null
	subjectId: string
	topic: string
	user: EmbeddedUser
	answers: { id: string, userId: string }[]
	heldBy: QuestionHeld
	meta: QuestionMeta
	createdAt: number
	updatedAt: number
}
