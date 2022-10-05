import {
	EmbeddedUser,
	UserAvailability,
	UserBio,
	UserDates,
	UserMetaType,
	UserRoles,
	UserStatus,
	UserTutor
} from '../types'
import { BaseEntity } from '@stranerd/api-commons'

export class UserEntity extends BaseEntity {
	public readonly id: string
	public readonly bio: UserBio
	public readonly roles: UserRoles
	public readonly dates: UserDates
	public readonly meta: UserMetaType
	public readonly status: UserStatus
	public readonly tutor: UserTutor
	public readonly tutors: string[]
	public readonly availability: UserAvailability

	constructor ({
		             id, bio, roles, dates, meta, status, tutors, tutor, availability
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
		this.availability = availability
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

	isFreeBetween (from: number, to: number) {
		const hasNoBookedSession = this.availability.booked.every((e) => from >= e.to || to <= e.from)
		const hourFrom = UserEntity.getLastHour(from)
		const hourTo = UserEntity.getLastHour(to)
		const hoursBetween = UserEntity.getHoursBetween(hourFrom, hourTo)
		const free = hoursBetween.every((hr) => this.availability.free.includes(hr))
		return hasNoBookedSession && free
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
	availability: UserAvailability
}