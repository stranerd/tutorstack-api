import { UsersUseCases } from '@modules/users'
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	QueryParams,
	Request, validate,
	Validation
} from '@stranerd/api-commons'
import { AuthRole } from '@utils/types'
import { SubjectsUseCases } from '@modules/questions'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		const user = await UsersUseCases.find(req.params.id)
		if (!user) throw new NotFoundError()
		return user
	}

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
}