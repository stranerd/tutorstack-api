import { generateChangeStreams, mongoose } from '@stranerd/api-commons'
import { UserFromModel } from '../models/users'
import { UserChangeStreamCallbacks } from '@utils/changeStreams/auth/users'
import { AuthUserEntity } from '../../domain/entities/users'
import { UserMapper } from '../mappers/users'

const UserSchema = new mongoose.Schema<UserFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: false,
		default: ''
	},
	description: {
		type: String,
		required: false,
		default: ''
	},
	name: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	photo: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: null
	},
	isVerified: {
		type: Boolean,
		required: false,
		default: false
	},
	authTypes: {
		type: [String],
		set: (types: string[]) => Array.from(new Set(types)),
		required: false,
		default: []
	},
	roles: {
		type: Object as unknown as UserFromModel['roles'],
		required: false,
		default: {} as unknown as UserFromModel['roles']
	},
	lastSignedInAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	signedUpAt: {
		type: Number,
		required: false,
		default: Date.now
	}
})

export const User = mongoose.model<UserFromModel>('AuthUser', UserSchema)

generateChangeStreams<UserFromModel, AuthUserEntity>(User, UserChangeStreamCallbacks, new UserMapper().mapFrom).then()

export default User