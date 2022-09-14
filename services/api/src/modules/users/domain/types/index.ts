import { MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types'

export type UserBio = {
	email: string
	name: {
		first: string
		last: string
		full: string
	}
	photo: MediaOutput | null
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

export enum UserMeta {
	questions = 'questions',
	answers = 'answers',
	bestAnswers = 'bestAnswers'
}

export type UserMetaType = Record<UserMeta, number>

export type EmbeddedUser = {
	id: string
	bio: UserBio
	roles: UserRoles
}
