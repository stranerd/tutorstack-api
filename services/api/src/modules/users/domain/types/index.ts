import { MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types'

export type Media = MediaOutput
export { Currencies } from '@modules/payment'

export type UserBio = {
	email: string
	name: {
		first: string
		last: string
		full: string
	}
	photo: Media | null
}

export type UserRoles = AuthRoles

export type UserDates = {
	createdAt: number
	deletedAt: number | null
}

export type UserStatus = {
	connections: string[]
	lastUpdatedAt: number
}

export type UserTutor = {
	subjects: string[]
}

export type UserAvailability = {
	free: number[]
	booked: { sessionId: string, from: number, to: number }[]
}

export enum UserMeta {
	questions = 'questions',
	answers = 'answers',
	students = 'students'
}

export type UserMetaType = Record<UserMeta, number>

export type EmbeddedUser = {
	id: string
	bio: UserBio
	roles: UserRoles
}
