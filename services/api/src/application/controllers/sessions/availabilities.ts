import { AvailabilitiesUseCases } from '@modules/sessions'
import { NotAuthorizedError, Request, Schema, validateReq } from 'equipped'

export class AvailabilitiesController {
	static async getUser (req: Request) {
		return await AvailabilitiesUseCases.getUser(req.params.userId)
	}

	static async updateAvailability (req: Request) {
		const aDayInMs = 24 * 60 * 60 * 1000
		const today = Math.floor(Date.now() / aDayInMs) * aDayInMs
		const twoWeeksFromNow = today + (aDayInMs * 14)

		const data = validateReq({
			time: Schema.time()
				.min(today, 'cannot set time less than today')
				.max(twoWeeksFromNow, 'cannot set time more than 2 weeks ahead')
				.asStamp(),
			add: Schema.boolean()
		}, req.body)

		const availability = await AvailabilitiesUseCases.update({ ...data, userId: req.authUser!.id })
		if (availability) return availability
		throw new NotAuthorizedError()
	}
}