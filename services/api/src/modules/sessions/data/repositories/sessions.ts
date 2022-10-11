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
			for (const userId of participants) {
				const availability = this.availabilityMapper.mapFrom(
					await Availability.findOneAndUpdate({ userId }, { $setOnInsert: { userId } }, {
						upsert: true,
						new: true,
						session
					})
				)!
				if (!availability.isFreeBetween(start, end)) throw new Error('some as are not free within this time period')
			}
			res = await new Session({ ...data, endedAt: end }).save({ session })
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

	async close (id: string, userId: string) {
		let res = false
		const session = await mongoose.startSession()
		await session.withTransaction(async (session) => {
			const updatedSession = this.mapper.mapFrom(await Session.findOneAndUpdate(
				{ _id: id, closedAt: null, cancelled: null, 'tutor.id': userId },
				{ $set: { closedAt: Date.now() } },
				{ session }
			))
			if (!updatedSession) return false
			const participants = [updatedSession.tutor.id, ...updatedSession.students.map((s) => s.id)]
			await Availability.updateMany({ _id: { $in: participants } }, {
				pull: {
					'booked': {
						sessionId: updatedSession.id,
						from: updatedSession.startedAt,
						to: updatedSession.endedAt
					}
				}
			}, { session })
			res = !!updatedSession
			return res
		})
		await session.endSession()
		return res
	}

	async cancel (id: string, userId: string, reason: string) {
		let res = false
		const session = await mongoose.startSession()
		await session.withTransaction(async (session) => {
			const sessionToUpdate = this.mapper.mapFrom(await Session.findById(id))
			if (!sessionToUpdate || sessionToUpdate.closedAt !== null || sessionToUpdate.cancelled !== null) return false
			// eslint-disable-next-line no-empty
			else if (sessionToUpdate.tutor.id === userId) {
			} else if (sessionToUpdate.students.at(0)?.id === userId && sessionToUpdate.startedAt < Date.now()) return false
			else return false
			const updatedSession = await Session.findByIdAndUpdate(id,
				{ $set: { cancelled: { userId, reason, at: Date.now() }, closedAt: Date.now() } },
				{ session }
			)
			if (!updatedSession) return false
			const participants = [sessionToUpdate.tutor.id, ...sessionToUpdate.students.map((s) => s.id)]
			await Availability.updateMany({ _id: { $in: participants } }, {
				pull: {
					'booked': {
						sessionId: updatedSession.id,
						from: updatedSession.startedAt,
						to: updatedSession.endedAt
					}
				}
			}, { session })
			res = !!updatedSession
			return res
		})
		await session.endSession()
		return res
	}
}
