import { TagsUseCases, TagTypes } from '@modules/interactions'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'

export class TagController {
	static async FindTag (req: Request) {
		return await TagsUseCases.find(req.params.id)
	}

	static async GetTags (req: Request) {
		const query = req.query as QueryParams
		return await TagsUseCases.get(query)
	}

	static async UpdateTag (req: Request) {
		const data = validate({
			title: req.body.title
		}, {
			title: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		const updatedTag = await TagsUseCases.update({ id: req.params.id, data })

		if (updatedTag) return updatedTag
		throw new NotAuthorizedError()
	}

	static async CreateTag (req: Request) {
		const data = validate({
			title: req.body.title,
			type: req.body.type,
			parent: req.body.parent
		}, {
			title: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			type: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(Object.keys(TagTypes), (cur, val) => cur === val)]
			},
			parent: { required: true, nullable: true, rules: [Validation.isString] }
		})

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