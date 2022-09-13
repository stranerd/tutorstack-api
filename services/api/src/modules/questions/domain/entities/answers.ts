import { BaseEntity } from '@stranerd/api-commons'
import { AnswerMeta, EmbeddedUser, Media } from '../types'

export class AnswerEntity extends BaseEntity {
	public readonly id: string
	public readonly best: boolean
	public readonly questionId: string
	public readonly attachment: Media
	public readonly user: EmbeddedUser
	public readonly meta: AnswerMeta
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor ({
		             id, questionId,
		             createdAt, user, attachment, meta,
		             best, updatedAt
	             }: AnswerConstructorArgs) {
		super()
		this.id = id
		this.questionId = questionId
		this.user = user
		this.attachment = attachment
		this.best = best ?? false
		this.meta = meta
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}
}

type AnswerConstructorArgs = {
	id: string
	questionId: string
	attachment: Media
	createdAt: number
	updatedAt: number
	user: EmbeddedUser
	best: boolean
	meta: AnswerMeta
}
