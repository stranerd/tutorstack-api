import { SessionsUseCases } from '@modules/users'
import { NotAuthorizedError, NotFoundError, QueryParams, Request } from '@stranerd/api-commons'

export class SessionsController {
	static async getSessions (req: Request) {
		const query = req.query as QueryParams
		return await SessionsUseCases.get(query)
	}

	static async findSession (req: Request) {
		const session = await SessionsUseCases.find(req.params.id)
		if (!session) throw new NotFoundError()
		if (!session.getParticipants().includes(req.authUser!.id)) throw new NotAuthorizedError()
		return session
	}
}