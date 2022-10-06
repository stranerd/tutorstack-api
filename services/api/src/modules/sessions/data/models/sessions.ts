import { Currencies, EmbeddedUser, Media, SessionCancelled } from '../../domain/types'

export interface SessionFromModel extends SessionToModel {
	_id: string
	endedAt: number
	paid: string[]
	cancelled: SessionCancelled | null
	closedAt: number | null
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