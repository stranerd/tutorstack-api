import { makeMiddleware, NotAuthenticatedError, NotAuthorizedError } from '@stranerd/api-commons'
import { SupportedAuthRoles } from '@utils/types/auth'

export const isTutor = makeMiddleware(
	async (request) => {
		const isTutor = request.authUser?.roles?.[SupportedAuthRoles.isTutor]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isTutor) throw new NotAuthorizedError()
	}
)
