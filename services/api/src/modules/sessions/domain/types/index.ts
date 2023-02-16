import { MediaOutput } from 'equipped'

export { Currencies } from '@modules/payment'
export { EmbeddedUser } from '@modules/users'
export type Booked = { sessionId: string, from: number, to: number }
export type Media = MediaOutput

export type SessionCancelled = {
	userId: string
	at: number
	reason: string
}