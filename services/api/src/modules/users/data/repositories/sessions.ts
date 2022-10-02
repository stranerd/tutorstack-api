import { ISessionRepository } from '../../domain/irepositories/sessions'
import { SessionMapper } from '../mappers/sessions'
import { SessionFromModel, SessionToModel } from '../models/sessions'
import { Session } from '../mongooseModels/sessions'
import { parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser } from '../../domain/types'

export class SessionRepository implements ISessionRepository {
	private static instance: SessionRepository
	private mapper: SessionMapper

	private constructor () {
		this.mapper = new SessionMapper()
	}

	static getInstance () {
		if (!SessionRepository.instance) SessionRepository.instance = new SessionRepository()
		return SessionRepository.instance
	}

	async get (query: QueryParams) {
		const data = await parseQueryParams<SessionFromModel>(Session, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async add (data: SessionToModel) {
		const session = await new Session(data).save()
		return this.mapper.mapFrom(session)!
	}

	async find (id: string) {
		const session = await Session.findById(id)
		return this.mapper.mapFrom(session)
	}

	async updateUserBio (user: EmbeddedUser) {
		const result = await Promise.all([
			Session.updateMany({},
				{ $set: { 'students.$[student]': user } },
				{ arrayFilters: [{ 'student.id': user.id }] }),
			Session.updateMany({ 'tutor.id': user.id }, { $set: { tutor: user } })
		])
		return result.every((r) => r.acknowledged)
	}

	async updatePaid (id: string, userId: string, add: boolean) {
		const session = await Session.findOneAndUpdate({ _id: id, 'students.id': userId }, {
			[add ? '$addToSet' : '$pull']: { paid: userId }
		})
		return !!session
	}
}
