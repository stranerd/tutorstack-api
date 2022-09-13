import { AnswerMeta, EmbeddedUser, Media } from '../../domain/types'

export interface AnswerFromModel extends AnswerToModel {
	_id: string
	best: boolean
	meta: AnswerMeta
	createdAt: number
	updatedAt: number
}

export interface AnswerToModel {
	attachment: Media
	questionId: string
	user: EmbeddedUser
}
