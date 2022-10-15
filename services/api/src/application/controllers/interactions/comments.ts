import { CommentsUseCases, InteractionEntities } from '@modules/interactions'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { UsersUseCases } from '@modules/users'
import { verifyInteractionEntity } from '@utils/modules/interactions'

export class CommentsController {
	static async getComments (req: Request) {
		const query = req.query as QueryParams
		return await CommentsUseCases.get(query)
	}

	static async findComment (req: Request) {
		return await CommentsUseCases.find(req.params.id)
	}

	static async createComment (req: Request) {
		const { body, entityType, entityId } = validate({
			body: req.body.body,
			entityType: req.body.entity?.type,
			entityId: req.body.entity?.id
		}, {
			body: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] },
			entityType: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(Object.values(InteractionEntities), (cur, val) => cur === val)]
			},
			entityId: { required: true, rules: [Validation.isString] }
		})

		await verifyInteractionEntity(entityType, entityId, 'comments')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await CommentsUseCases.create({
			body, entity: { id: entityId, type: entityType },
			user: user.getEmbedded()
		})
	}

	static async updateComment (req: Request) {
		const { body } = validate({
			body: req.body.body
		}, {
			body: { required: true, rules: [Validation.isString, Validation.isLongerThanX(0)] }
		})

		const updated = await CommentsUseCases.update({
			id: req.params.id, userId: req.authUser!.id, data: { body }
		})
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async deleteComment (req: Request) {
		const isDeleted = await CommentsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}