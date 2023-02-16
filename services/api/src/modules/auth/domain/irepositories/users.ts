import { QueryParams, QueryResults } from 'equipped'
import { AuthUserEntity } from '../entities/users'
import { RegisterInput, RoleInput, UserUpdateInput } from '../types'

export interface IUserRepository {
	findUser (id: string): Promise<AuthUserEntity | null>

	getUsers (query: QueryParams): Promise<QueryResults<AuthUserEntity>>

	updateUserRole (roleInput: RoleInput): Promise<boolean>

	updateDetails (userId: string, credentials: RegisterInput): Promise<AuthUserEntity>

	updateUserProfile (userId: string, input: UserUpdateInput): Promise<AuthUserEntity>

	updatePassword (userId: string, password: string): Promise<boolean>

	deleteUsers (userIds: string[]): Promise<void>
}