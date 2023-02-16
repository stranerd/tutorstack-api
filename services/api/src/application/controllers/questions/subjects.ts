import { SubjectsUseCases } from '@modules/questions'
import { NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class SubjectController {
	static async FindSubject (req: Request) {
		return await SubjectsUseCases.find(req.params.id)
	}

	static async GetSubjects (req: Request) {
		const query = req.query as QueryParams
		return await SubjectsUseCases.get(query)
	}

	static async UpdateSubject (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1)
		}, req.body)

		const updatedSubject = await SubjectsUseCases.update({ id: req.params.id, data })

		if (updatedSubject) return updatedSubject
		throw new NotAuthorizedError()
	}

	static async CreateSubject (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1)
		}, req.body)
		return await SubjectsUseCases.add(data)
	}

	static async DeleteSubject (req: Request) {
		const isDeleted = await SubjectsUseCases.delete({ id: req.params.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}