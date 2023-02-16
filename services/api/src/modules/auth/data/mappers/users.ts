import { BaseMapper } from 'equipped'
import { AuthUserEntity } from '../../domain/entities/users'
import { UserFromModel, UserToModel } from '../models/users'

export class UserMapper extends BaseMapper<UserFromModel, UserToModel, AuthUserEntity> {
	mapFrom (param: UserFromModel | null) {
		return !param ? null : new AuthUserEntity({
			id: param._id.toString(),
			email: param.email,
			password: param.password,
			roles: param.roles,
			name: param.name,
			description: param.description,
			photo: param.photo,
			isVerified: param.isVerified,
			authTypes: param.authTypes,
			lastSignedInAt: param.lastSignedInAt,
			signedUpAt: param.signedUpAt
		})
	}

	mapTo (param: AuthUserEntity) {
		return {
			email: param.email,
			description: param.description,
			password: param.password,
			roles: param.roles,
			name: param.name,
			photo: param.photo,
			isVerified: param.isVerified,
			authTypes: param.authTypes,
			lastSignedInAt: param.lastSignedInAt,
			signedUpAt: param.signedUpAt
		}
	}
}