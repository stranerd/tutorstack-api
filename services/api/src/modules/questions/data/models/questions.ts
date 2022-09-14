import { EmbeddedUser, Media } from '../../domain/types'

export interface QuestionFromModel extends QuestionToModel {
	_id: string
	answers: { id: string, userId: string }[]
	createdAt: number
	updatedAt: number
}

export interface QuestionToModel {
	body: string
	attachment: Media | null
	subjectId: string
	topic: string
	user: EmbeddedUser
}
