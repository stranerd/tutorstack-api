import {
	UserAvailability,
	UserBio,
	UserDates,
	UserMetaType,
	UserRoles,
	UserStatus,
	UserTutor
} from '../../domain/types'

export interface UserFromModel extends UserToModel {
	_id: string
}

export interface UserToModel {
	bio: UserBio
	roles: UserRoles
	dates: UserDates
	meta: UserMetaType
	status: UserStatus
	tutors: string[]
	tutor: UserTutor
	availability: UserAvailability
}
