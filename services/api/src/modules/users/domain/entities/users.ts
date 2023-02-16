import { BaseEntity, Validation } from 'equipped'
import { EmbeddedUser, UserBio, UserDates, UserMetaType, UserRatings, UserRoles, UserStatus, UserTutor } from '../types'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly meta: UserMetaType
	public readonly status: UserStatus
	public readonly tutor: UserTutor
	public readonly tutors: string[]
	public readonly ratings: UserRatings

	constructor ({
		id, bio, roles, dates, meta, status, tutors, tutor, ratings
	}: UserConstructorArgs) {
		super()
		this.id = id
		this.bio = bio ?? {}
		this.roles = roles ?? {}
		this.dates = dates
		this.meta = meta
		this.status = status
		this.tutor = tutor
		this.tutors = tutors
		this.ratings = ratings
	}

	static getLastHour (time: number) {
		const anHourInMs = 60 * 60 * 1000
		return Math.floor(time / anHourInMs) * anHourInMs
	}

	static getHoursBetween (from: number, to: number) {
		if (to <= from) return [from]
		const anHourInMs = 60 * 60 * 1000
		return new Array((to - from) / anHourInMs)
			.fill(0)
			.map((_, i) => (i * anHourInMs) + from)
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
	tutor: UserTutor
	tutors: string[]
	ratings: UserRatings
}


const generateDefaultBio = (bio: Partial<UserBio>): UserBio => {
	const first = Validation.capitalize(bio?.name?.first ?? 'Anon')
	const last = Validation.capitalize(bio?.name?.last ?? 'Ymous')
	const full = Validation.capitalize(bio?.name?.full ?? (first + ' ' + last))
	const email = bio?.email ?? 'anon@ymous.com'
	const description = bio?.description ?? ''
	const photo = bio?.photo ?? null
	return {
		name: { first, last, full },
		email, photo, description
	}
}

const generateDefaultRoles = (roles: Partial<UserRoles>): UserRoles => {
	return roles ?? {}
}

export const generateDefaultUser = (user: Partial<EmbeddedUser>): EmbeddedUser => {
	const id = user?.id ?? ''
	const bio = generateDefaultBio(user?.bio ?? {})
	const roles = generateDefaultRoles(user?.roles ?? {})
	return { id, bio, roles }
}