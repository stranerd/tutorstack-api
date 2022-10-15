import { InteractionEntities, LikesUseCases } from '@modules/interactions'
import { BadRequestError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { UsersUseCases } from '@modules/users'
import { verifyInteractionEntity } from '@utils/modules/interactions'

export class LikesController {
	static async getLikes (req: Request) {
		const query = req.query as QueryParams
		return await LikesUseCases.get(query)
	}

	static async findLike (req: Request) {
		return await LikesUseCases.find(req.params.id)
	}

	static async createLike (req: Request) {
		const { entityType, entityId, value } = validate({
			entityType: req.body.entity?.type,
			entityId: req.body.entity?.id,
			value: req.body.value
		}, {
			entityType: {
				required: true,
				rules: [Validation.isString, Validation.arrayContainsX(Object.values(InteractionEntities), (cur, val) => cur === val)]
			},
			entityId: { required: true, rules: [Validation.isString] },
			value: { required: true, rules: [Validation.isBoolean] }
		})

		await verifyInteractionEntity(entityType, entityId, value ? 'likes' : 'dislikes')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await LikesUseCases.like({
			value, entity: { id: entityId, type: entityType },
			user: user.getEmbedded()
		})
	}
}