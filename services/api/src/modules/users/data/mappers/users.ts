import { BaseMapper } from 'equipped'
import { UserEntity } from '../../domain/entities/users'
import { UserFromModel, UserToModel } from '../models/users'

export class UserMapper extends BaseMapper<UserFromModel, UserToModel, UserEntity> {
	mapFrom (param: UserFromModel | null) {
		return !param ? null : new UserEntity({
			id: param._id.toString(),
			bio: param.bio,
			dates: param.dates,
			roles: param.roles,
			meta: param.meta,
			status: param.status,
			tutor: param.tutor,
			tutors: param.tutors,
			ratings: param.ratings
		})
	}

	mapTo (param: UserEntity) {
		return {
			bio: param.bio,
			dates: param.dates,
			roles: param.roles,
			meta: param.meta,
			status: param.status,
			tutor: param.tutor,
			tutors: param.tutors,
			ratings: param.ratings
		}
	}
}