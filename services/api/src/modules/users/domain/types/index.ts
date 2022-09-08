import { MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types/auth'

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
