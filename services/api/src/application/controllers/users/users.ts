import { SubjectsUseCases } from '@modules/questions'
import { UsersUseCases } from '@modules/users'
import {
	AuthRole,
	BadRequestError,
	NotAuthorizedError,
	QueryParams,
	Request, Schema, validateReq
} from 'equipped'

export class UsersController {
	static async getUsers (req: Request) {
		const query = req.query as QueryParams
		return await UsersUseCases.get(query)
	}

	static async findUser (req: Request) {
		return await UsersUseCases.find(req.params.id)
	}

	static async updateUserTutors (req: Request) {
		const data = validateReq({
			tutorId: Schema.string().min(1),
			add: Schema.boolean()
		}, req.body)

		if (data.add) {
			const tutor = await UsersUseCases.find(data.tutorId)
			if (!tutor || !tutor.roles[AuthRole.isTutor]) throw new BadRequestError('invalid tutorId')
		}

		const user = await UsersUseCases.updateUserTutors({ ...data, userId: req.authUser!.id })
		if (user) return user
		throw new NotAuthorizedError()
	}

	static async updateTutorSubjects (req: Request) {
		const data = validateReq({
			subjectId: Schema.string().min(1),
			add: Schema.boolean()
		}, req.body)

		if (data.add) {
			const subject = await SubjectsUseCases.find(data.subjectId)
			if (!subject) throw new BadRequestError('invalid subjectId')
		}

		const user = await UsersUseCases.updateTutorSubjects({ ...data, userId: req.authUser!.id })
		if (user) return user
		throw new NotAuthorizedError()
	}
}