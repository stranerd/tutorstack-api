import { EmbeddedUser, UserBio, UserDates, UserMetaType, UserRoles, UserStatus } from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly meta: UserMetaType
	public readonly status: UserStatus
	public readonly tutors: string[]

	constructor ({
		             id, bio, roles, dates, meta, status, tutors
	             }: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = bio ?? {}
		this.roles = roles ?? {}
		this.dates = dates
		this.meta = meta
		this.status = status
		this.tutors = tutors
	}

	getEmbedded (): EmbeddedUser {
		return {
			id: this.id,
			bio: this.bio,
			roles: this.roles
		}
	}
}

type UserConstructorArgs = {
	id: string
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	meta: UserMetaType
	status: UserStatus
	tutors: string[]
}