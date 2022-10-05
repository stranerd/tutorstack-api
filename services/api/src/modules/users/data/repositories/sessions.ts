import { ISessionRepository } from '../../domain/irepositories/sessions'
import { SessionMapper } from '../mappers/sessions'
import { UserMapper } from '../mappers/users'
import { SessionFromModel, SessionToModel } from '../models/sessions'
import { Session } from '../mongooseModels/sessions'
import { User } from '../mongooseModels/users'
import { mongoose, parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser } from '../../domain/types'

export class SessionRepository implements ISessionRepository {
	private static instance: SessionRepository
	private mapper: SessionMapper
	private userMapper: UserMapper

	private constructor () {
		this.mapper = new SessionMapper()
		this.userMapper = new UserMapper()
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
		let res = null as any
		const session = await mongoose.startSession()
		const start = data.startedAt
		const end = start + (data.lengthInMinutes * 60 * 1000)
		await session.withTransaction(async (session) => {
			const participants = [data.tutor.id, ...data.students.map((s) => s.id)]
			const users = (await User.find({ _id: { $in: participants } }, { session })).map((u) => this.userMapper.mapFrom(u)!)
			for (const user of users) if (user.isFreeBetween(start, end)) throw new Error('some users are not free within this time period')
			res = await new Session(data).save({ session })
			await User.updateMany({ _id: { $in: participants } }, {
				$addToSet: { 'availability.booked': { sessionId: res._id, from: start, to: end } }
			}, { session })
		})
		await session.endSession()
		return this.mapper.mapFrom(res)!
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
