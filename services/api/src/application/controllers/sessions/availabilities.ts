import { AvailabilitiesUseCases } from '@modules/sessions'
import { NotAuthorizedError, Request, validate, Validation } from '@stranerd/api-commons'

export class AvailabilitiesController {
	static async updateAvailability (req: Request) {
		const aDayInMs = 24 * 60 * 60 * 1000
		const today = Math.floor(Date.now() / aDayInMs) * aDayInMs
		const twoWeeksFromNow = today + (aDayInMs * 14)

		const data = validate({
			time: req.body.time,
			add: req.body.add
		}, {
			time: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(today, 'cannot set time less than today'), Validation.isLessThanOrEqualToX(twoWeeksFromNow, 'cannot set time more than 2 weeks ahead')]
			},
			add: { required: true, rules: [Validation.isBoolean] }
		})

		const availability = await AvailabilitiesUseCases.update({ ...data, userId: req.authUser!.id })
		if (availability) return availability
		throw new NotAuthorizedError()
	}
}