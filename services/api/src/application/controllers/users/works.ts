import { StorageUseCases } from '@modules/storage'
import { WorksUseCases } from '@modules/users'
import { NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class WorkController {
	static async FindWork (req: Request) {
		return await WorksUseCases.find(req.params.id)
	}

	static async GetWorks (req: Request) {
		const query = req.query as QueryParams
		return await WorksUseCases.get(query)
	}

	static async UpdateWork (req: Request) {
		const authUserId = req.authUser!.id
		const uploadedVerification = req.files.verification?.[0] ?? null
		const changedVerification = !!uploadedVerification || req.body.verification === null

		const data = validateReq({
			institution: Schema.string().min(1),
			position: Schema.string().min(1),
			from: Schema.time().asStamp(),
			to: Schema.time().min(req.body.from).asStamp(),
			verification: Schema.file().nullable()
		}, { ...req.body, verification: uploadedVerification })

		const verification = uploadedVerification ? await StorageUseCases.upload('users/works', uploadedVerification) : undefined

		const updatedWork = await WorksUseCases.update({
			id: req.params.id,
			userId: authUserId,
			data: {
				institution: data.institution, position: data.position, from: data.from, to: data.to,
				...(changedVerification ? { verification } : {})
			}
		})

		if (updatedWork) return updatedWork
		throw new NotAuthorizedError()
	}

	static async CreateWork (req: Request) {
		const data = validateReq({
			institution: Schema.string().min(1),
			position: Schema.string().min(1),
			from: Schema.time().asStamp(),
			to: Schema.time().min(req.body.from).asStamp(),
			verification: Schema.file()
		}, { ...req.body, verification: req.files.verification?.[0] ?? null })

		const authUserId = req.authUser!.id
		const verification = await StorageUseCases.upload('users/works', data.verification)
		return await WorksUseCases.add({ ...data, verification, userId: authUserId })
	}

	static async DeleteWork (req: Request) {
		const isDeleted = await WorksUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}