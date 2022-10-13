import { AuthTypes, MediaOutput } from '@stranerd/api-commons'
import { AuthRoles } from '@utils/types'

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
	authTypes: AuthTypes[]
}