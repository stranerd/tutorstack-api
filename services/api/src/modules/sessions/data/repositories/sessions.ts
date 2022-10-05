import { ISessionRepository } from '../../domain/irepositories/sessions'
import { SessionMapper } from '../mappers/sessions'
import { AvailabilityMapper } from '../mappers/availabilities'
import { SessionFromModel, SessionToModel } from '../models/sessions'
import { Session } from '../mongooseModels/sessions'
import { Availability } from '../mongooseModels/availabilities'
import { mongoose, parseQueryParams, QueryParams } from '@stranerd/api-commons'
import { EmbeddedUser } from '../../domain/types'

export class SessionRepository implements ISessionRepository {
	private static instance: SessionRepository
	private mapper: SessionMapper
	private availabilityMapper: AvailabilityMapper

	private constructor () {
		this.mapper = new SessionMapper()
		this.availabilityMapper = new AvailabilityMapper()
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
			const availabilities = (await Availability.find({ _id: { $in: participants } }, { session }))
				.map((u) => this.availabilityMapper.mapFrom(u)!)
			for (const availability of availabilities) if (availability.isFreeBetween(start, end)) throw new Error('some as are not free within this time period')
			res = await new Session(data).save({ session })
			await Availability.updateMany({ _id: { $in: participants } }, {
				$addToSet: { 'booked': { sessionId: res._id, from: start, to: end } }
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
