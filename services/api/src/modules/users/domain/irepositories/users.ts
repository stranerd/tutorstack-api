import { QueryParams, QueryResults } from 'equipped'
import { UserEntity } from '../entities/users'
import { UserBio, UserMeta, UserRoles } from '../types'

export interface IUserRepository {
	get (query: QueryParams): Promise<QueryResults<UserEntity>>

	createUserWithBio (userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithBio (userId: string, data: UserBio, timestamp: number): Promise<void>

	updateUserWithRoles (userId: string, data: UserRoles, timestamp: number): Promise<void>

	markUserAsDeleted (userId: string, timestamp: number): Promise<void>

	find (userId: string): Promise<UserEntity | null>

	updateUserStatus (userId: string, socketId: string, add: boolean): Promise<boolean>

	resetAllUsersStatus (): Promise<boolean>

	incrementUserMeta (userIds: string[], key: UserMeta, value: 1 | -1): Promise<void>

	updateUserTutors (userId: string, tutorId: string, add: boolean): Promise<UserEntity | null>

	removeSavedTutors (tutorId: string): Promise<boolean>

	updateTutorSubjects (userId: string, subjectId: string, add: boolean): Promise<UserEntity | null>

	removeSavedSubjects (subjectId: string): Promise<boolean>

	updateRatings (userId: string, ratings: number, add: boolean): Promise<boolean>
}