import { EmbeddedUser, Media } from '../../domain/types'

export interface SessionFromModel extends SessionToModel {
	_id: string
	createdAt: number
	updatedAt: number
}

export interface SessionToModel {
	tutor: EmbeddedUser
	students: EmbeddedUser[]
	paid: string[]
	subjectId: string
	topic: string
	description: string
	attachments: Media[]
	startedAt: number
	lengthInMinutes: number
}