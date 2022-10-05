import { MediaOutput } from '@stranerd/api-commons'

export { EmbeddedUser } from '@modules/users'
export { Currencies } from '@modules/payment'
export type Booked = { sessionId: string, from: number, to: number }
export type Media  = MediaOutput