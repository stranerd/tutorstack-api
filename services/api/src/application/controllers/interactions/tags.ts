import { TagsUseCases, TagTypes } from '@modules/interactions'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class TagController {
	static async FindTag (req: Request) {
		return await TagsUseCases.find(req.params.id)
	}

	static async GetTags (req: Request) {
		const query = req.query as QueryParams
		return await TagsUseCases.get(query)
	}

	static async UpdateTag (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1)
		}, req.body)

		const updatedTag = await TagsUseCases.update({ id: req.params.id, data })

		if (updatedTag) return updatedTag
		throw new NotAuthorizedError()
	}

	static async CreateTag (req: Request) {
		const data = validateReq({
			title: Schema.string().min(1),
			type: Schema.any<TagTypes>().in(Object.values(TagTypes)),
			parent: Schema.string().nullable()
		}, req.body)

		if (data.parent !== null) {
			const parent = await TagsUseCases.find(data.parent)
			if (!parent) throw new BadRequestError('parent not found')
			if (parent.parent) throw new BadRequestError('invalid parent')
			if (parent.type !== data.type) throw new BadRequestError('new tag needs to be of same type with parent')
		}
		return await TagsUseCases.add(data)
	}

	static async DeleteTag (req: Request) {
		const isDeleted = await TagsUseCases.delete({ id: req.params.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}