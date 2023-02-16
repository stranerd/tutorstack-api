import { StorageUseCases } from '@modules/storage'
import { EducationsUseCases } from '@modules/users'
import { NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class EducationController {
	static async FindEducation (req: Request) {
		return await EducationsUseCases.find(req.params.id)
	}

	static async GetEducations (req: Request) {
		const query = req.query as QueryParams
		return await EducationsUseCases.get(query)
	}

	static async UpdateEducation (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedVerification = req.files.verification?.[0] ?? null
		const changedVerification = !!uploadedVerification || req.body.verification === null

		const data = validateReq({
			school: Schema.string().min(1),
			degree: Schema.string().min(1),
			from: Schema.time().asStamp(),
			to: Schema.time().min(req.body.from).asStamp(),
			verification: Schema.file().nullable()
		}, { ...req.body, verification: uploadedVerification })

		const verification = uploadedVerification ? await StorageUseCases.upload('users/educations', uploadedVerification) : undefined

		const updatedEducation = await EducationsUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: {
				school: data.school, degree: data.degree, from: data.from, to: data.to,
				...(changedVerification ? { verification } : {})
			}
		})

		if (updatedEducation) return updatedEducation
		throw new NotAuthorizedError()
	}

	static async CreateEducation (req: Request) {
		const data = validateReq({
			school: Schema.string().min(1),
			degree: Schema.string().min(1),
			from: Schema.time().asStamp(),
			to: Schema.time().min(req.body.from).asStamp(),
			verification: Schema.file()
		}, { ...req.body, verification: req.files.verification?.[0] ?? null })

		const authUserId = req.authUser!.id
		const verification = await StorageUseCases.upload('users/educations', data.verification)
		return await EducationsUseCases.add({ ...data, verification, userId: authUserId })
	}

	static async DeleteEducation (req: Request) {
		const isDeleted = await EducationsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}