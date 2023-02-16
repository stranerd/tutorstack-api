import { isAuthenticated, isTutor } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'
import { AvailabilitiesController } from '../../controllers/sessions/availabilities'

export const availabilitiesRoutes: Route[] = [
	{
		path: '/sessions/availabilities/:userId',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AvailabilitiesController.getUser(req)
				}
			})
		]
	},
	{
		path: '/sessions/availabilities/',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await AvailabilitiesController.updateAvailability(req)
				}
			})
		]
	}
]