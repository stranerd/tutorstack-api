import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { TutorsController } from '../../controllers/users/tutors'
import { isAuthenticated, isTutor } from '@application/middlewares'

export const tutorsRoutes: Route[] = [
	{
		path: '/users/tutors/saved',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TutorsController.updateUserTutors(req)
				}
			})
		]
	},
	{
		path: '/users/tutors/subjects',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TutorsController.updateUserTutors(req)
				}
			})
		]
	},
	{
		path: '/users/tutors/availability',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TutorsController.updateAvailability(req)
				}
			})
		]
	}
]