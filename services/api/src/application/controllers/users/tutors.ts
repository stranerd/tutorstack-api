import { UsersUseCases } from '@modules/users'
import { BadRequestError, Request, validate, Validation } from '@stranerd/api-commons'
import { SupportedAuthRoles } from '@utils/types'

export class TutorsController {
	static async saveTutors (req: Request) {
		const data = validate({
			tutorId: req.body.tutorId,
			add: req.body.add,
		}, {
			tutorId: { required: true, rules: [Validation.isString] },
			add: { required: true, rules: [Validation.isBoolean] }
		})

		if (data.add) {
			const tutor = await UsersUseCases.find(data.tutorId)
			if (!tutor || !tutor.roles[SupportedAuthRoles.isTutor]) throw new BadRequestError('invalid tutorId')
		}

		const authUserId = req.authUser!.id
		return await UsersUseCases.updateUserTutors({ ...data, userId: authUserId })
	}
}