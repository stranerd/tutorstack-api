import { InteractionEntities, ViewsUseCases } from '@modules/interactions'
import { UsersUseCases } from '@modules/users'
import { verifyInteractionEntity } from '@utils/modules/interactions'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, Schema, validateReq } from 'equipped'

export class ViewsController {
	static async getViews (req: Request) {
		const query = req.query as QueryParams
		return await ViewsUseCases.get(query)
	}

	static async findView (req: Request) {
		return await ViewsUseCases.find(req.params.id)
	}

	static async createView (req: Request) {
		const { entity } = validateReq({
			entity: Schema.object({
				id: Schema.string().min(1),
				type: Schema.any<InteractionEntities>().in(Object.values(InteractionEntities))
			})
		}, req.body)

		const userId = await verifyInteractionEntity(entity.type, entity.id, 'views')
		const user = await UsersUseCases.find(req.authUser!.id)
		if (!user) throw new BadRequestError('profile not found')

		return await ViewsUseCases.create({
			entity: { ...entity, userId },
			user: user.getEmbedded()
		})
	}

	static async deleteView (req: Request) {
		const isDeleted = await ViewsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}
}