import { AuthRole } from '@utils/types'
import {
	makeMiddleware,
	NotAuthenticatedError,
	NotAuthorizedError,
	requireAuthUser,
	requireRefreshUser
} from '@stranerd/api-commons'

export const isAuthenticatedButIgnoreVerified = makeMiddleware(
	async (request) => {
		await requireAuthUser(request)
	}
)

export const isAuthenticated = makeMiddleware(
	async (request) => {
		await requireAuthUser(request)
		if (!request.authUser?.isVerified) throw new NotAuthenticatedError('verify your account to proceed')
	}
)

export const hasRefreshToken = makeMiddleware(
	async (request) => {
		await requireRefreshUser(request)
	}
)

export const isAdmin = makeMiddleware(
	async (request) => {
		const isAdmin = request.authUser?.roles?.[AuthRole.isAdmin] || request.authUser?.roles?.[AuthRole.isSuperAdmin]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isAdmin) throw new NotAuthorizedError('only admins can access this route')
	}
)

export const isTutor = makeMiddleware(
	async (request) => {
		const isTutor = request.authUser?.roles?.[AuthRole.isTutor]
		if (!request.authUser) throw new NotAuthenticatedError()
		if (!isTutor) throw new NotAuthorizedError('only tutors can access this route')
	}
)