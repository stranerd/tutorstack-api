import { IAvailabilityRepository } from '../../domain/irepositories/availabilities'
import { AvailabilityMapper } from '../mappers/availabilities'
import { Availability } from '../mongooseModels/availabilities'
import { BadRequestError, mongoose, parseQueryParams } from '@stranerd/api-commons'
import { AvailabilityFromModel } from '../models/availabilities'
import { AvailabilityEntity } from '../../domain/entities/availabilities'

export class AvailabilityRepository implements IAvailabilityRepository {
	private static instance: AvailabilityRepository
	private mapper = new AvailabilityMapper()

	static getInstance (): AvailabilityRepository {
		if (!AvailabilityRepository.instance) AvailabilityRepository.instance = new AvailabilityRepository()
		return AvailabilityRepository.instance
	}

	async get (query) {
		const data = await parseQueryParams<AvailabilityFromModel>(Availability, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async getUser (userId: string) {
		const availability = await this.getOrCreate(userId)
		return this.mapper.mapFrom(availability)!
	}

	async update (userId: string, time: number, add: boolean) {
		const session = await mongoose.startSession()
		let res = null as any
		await session.withTransaction(async (session) => {
			const availabilityModel = await this.getOrCreate(userId, session)
			const availability = this.mapper.mapFrom(availabilityModel)!
			const lastHour = AvailabilityEntity.getLastHour(time)
			if (!availability.isFreeBetween(lastHour, lastHour + 60 * 60 * 1000, add)) throw new BadRequestError('not available')
			const updatedAvailability = await Availability.findByIdAndUpdate(availability.id,
				{ [add ? '$addToSet' : '$pull']: { 'free': lastHour } },
				{ session, new: true })
			res = updatedAvailability
			return updatedAvailability
		})
		await session.endSession()
		return this.mapper.mapFrom(res)
	}

	async removeOld () {
		const time = AvailabilityEntity.getLastHour(Date.now())
		const res = await Availability.updateMany(
			{ 'free': time },
			{ $pull: { 'free': { $lt: time } } }
		)
		return !!res.acknowledged
	}

	private async getOrCreate (userId: string, session?: any) {
		return await Availability.findOneAndUpdate(
			{ userId },
			{ $setOnInsert: { userId } },
			{ upsert: true, new: true, ...(session ? { session } : {}) })
	}
}