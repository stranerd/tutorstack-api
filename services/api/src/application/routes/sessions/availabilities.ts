import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { AvailabilitiesController } from '../../controllers/sessions/availabilities'
import { isAuthenticated, isTutor } from '@application/middlewares'

export const availabilitiesRoutes: Route[] = [
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