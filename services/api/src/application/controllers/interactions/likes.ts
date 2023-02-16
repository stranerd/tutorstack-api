import { InteractionEntities, LikesUseCases } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { verifyInteractionEntity } from '@utils/modules/interactions'
import { BadRequestError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class LikesController {
	static async getLikes (req: Request) {
		const query = req.query as QueryParams
		return await LikesUseCases.get(query)
	}

	static async findLike (req: Request) {
		return await LikesUseCases.find(req.params.id)
	}

	static async createLike (req: Request) {
		const { entity, value } = validateReq({
			value: Schema.boolean(),
			entity: Schema.object({
				id: Schema.string().min(1),
				type: Schema.any<InteractionEntities>().in(Object.values(InteractionEntities))
			})
		}, req.body)

		const userId = await verifyInteractionEntity(entity.type, entity.id, value ? 'likes' : 'dislikes')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await LikesUseCases.like({
			value,
			entity: { ...entity, userId },
			user: user.getEmbedded()
		})
	}
}