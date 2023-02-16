import { AuthRoles, AuthTypes, Enum, MediaOutput } from 'equipped'

export interface UserFromModel extends UserToModel {
	_id: string
	roles: AuthRoles
	signedUpAt: number
	lastSignedInAt: number
}

export interface UserToModel {
	email: string
	password: string
	description: string
	name: { first: string, last: string }
	photo: MediaOutput | null
	isVerified: boolean
	authTypes: Enum<typeof AuthTypes>[]
}