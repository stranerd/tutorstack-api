import { AuthRoles, MediaOutput } from '@stranerd/api-commons'

export type Media = MediaOutput

export type UserBio = {
	email: string
	description: string
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

export enum UserMeta {
	questions = 'questions',
	answers = 'answers',
	students = 'students',
	sessionsAttended = 'sessionsAttended',
	sessionsHosted = 'sessionsHosted'
}

export type UserMetaType = Record<UserMeta, number>

export type UserRatings = {
	total: number
	count: number
	avg: number
}

export type EmbeddedUser = {
	id: string
	bio: UserBio
	roles: UserRoles
}
