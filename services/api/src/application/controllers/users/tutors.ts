import { UsersUseCases } from '@modules/users'
import { BadRequestError, NotAuthorizedError, Request, validate, Validation } from '@stranerd/api-commons'
import { AuthRole } from '@utils/types'
import { SubjectsUseCases } from '@modules/questions'

export class TutorsController {
	static async updateUserTutors (req: Request) {
		const data = validate({
			tutorId: req.body.tutorId,
			add: req.body.add
		}, {
			tutorId: { required: true, rules: [Validation.isString] },
			add: { required: true, rules: [Validation.isBoolean] }
		})

		if (data.add) {
			const tutor = await UsersUseCases.find(data.tutorId)
			if (!tutor || !tutor.roles[AuthRole.isTutor]) throw new BadRequestError('invalid tutorId')
		}

		const user = await UsersUseCases.updateUserTutors({ ...data, userId: req.authUser!.id })
		if (user) return user
		throw new NotAuthorizedError()
	}

	static async updateTutorSubjects (req: Request) {
		const data = validate({
			subjectId: req.body.subjectId,
			add: req.body.add
		}, {
			subjectId: { required: true, rules: [Validation.isString] },
			add: { required: true, rules: [Validation.isBoolean] }
		})

		if (data.add) {
			const subject = await SubjectsUseCases.find(data.subjectId)
			if (!subject) throw new BadRequestError('invalid subjectId')
		}

		const user = await UsersUseCases.updateTutorSubjects({ ...data, userId: req.authUser!.id })
		if (user) return user
		throw new NotAuthorizedError()
	}

	static async updateAvailability (req: Request) {
		const aDayInMs = 24 * 60 * 60 * 1000
		const today = Math.floor(Date.now() / aDayInMs) * aDayInMs
		const aWeekFromNow = today + (aDayInMs * 7)

		const data = validate({
			time: req.body.time,
			add: req.body.add
		}, {
			time: {
				required: true,
				rules: [Validation.isNumber, Validation.isMoreThanOrEqualToX(today, 'cannot set time less than today'), Validation.isLessThanOrEqualToX(aWeekFromNow, 'cannot set time more than a week ahead')]
			},
			add: { required: true, rules: [Validation.isBoolean] }
		})

		const user = await UsersUseCases.updateAvailability({ ...data, userId: req.authUser!.id })
		if (user) return user
		throw new NotAuthorizedError()
	}
}