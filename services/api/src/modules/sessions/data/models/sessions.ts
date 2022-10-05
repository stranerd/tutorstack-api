import { Currencies, EmbeddedUser, Media } from '../../domain/types'

export interface SessionFromModel extends SessionToModel {
	_id: string
	paid: string[]
	createdAt: number
	updatedAt: number
}

export interface SessionToModel {
	tutor: EmbeddedUser
	students: EmbeddedUser[]
	subjectId: string
	topic: string
	description: string
	attachments: Media[]
	startedAt: number
	lengthInMinutes: number
	price: number
	currency: Currencies
}