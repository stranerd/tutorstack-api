import { isAuthenticated } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'
import { SessionsController } from '../../controllers/sessions/sessions'

export const sessionsRoutes: Route[] = [
	{
		path: '/sessions/sessions/',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.getSessions(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.findSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.createSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/pay',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.payForSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/close',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.closeSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/cancel',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.cancelSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/rate',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.rateSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/join',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.joinSession(req)
				}
			})
		]
	},
	{
		path: '/sessions/sessions/:id/details',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await SessionsController.getSessionDetails(req)
				}
			})
		]
	}
]