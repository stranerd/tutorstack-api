import { IUserRepository } from '../irepositories/users'
import { UserBio, UserMeta, UserRoles } from '../types'
import { QueryParams } from '@stranerd/api-commons'

export class UsersUseCase {
	repository: IUserRepository

	constructor (repo: IUserRepository) {
		this.repository = repo
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async createUserWithBio (params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.createUserWithBio(params.id, params.data, params.timestamp)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async markUserAsDeleted (params: { id: string, timestamp: number }) {
		return await this.repository.markUserAsDeleted(params.id, params.timestamp)
	}

	async resetAllUsersStatus () {
		return await this.repository.resetAllUsersStatus()
	}

	async updateUserStatus (input: { userId: string, socketId: string, add: boolean }) {
		return await this.repository.updateUserStatus(input.userId, input.socketId, input.add)
	}

	async updateUserWithBio (params: { id: string, data: UserBio, timestamp: number }) {
		return await this.repository.updateUserWithBio(params.id, params.data, params.timestamp)
	}

	async updateUserWithRoles (params: { id: string, data: UserRoles, timestamp: number }) {
		return await this.repository.updateUserWithRoles(params.id, params.data, params.timestamp)
	}

	async incrementMeta (params: { ids: string[], value: 1 | -1, property: UserMeta }) {
		return await this.repository.incrementUserMeta(params.ids, params.property, params.value)
	}

	async updateUserTutors (input: { userId: string, tutorId: string, add: boolean }) {
		return await this.repository.updateUserTutors(input.userId, input.tutorId, input.add)
	}

	async removeSavedTutors (tutorId: string) {
		return await this.repository.removeSavedTutors(tutorId)
	}

	async updateTutorSubjects (input: { userId: string, subjectId: string, add: boolean }) {
		return await this.repository.updateTutorSubjects(input.userId, input.subjectId, input.add)
	}

	async removeSavedSubjects (subjectId: string) {
		return await this.repository.removeSavedSubjects(subjectId)
	}
}