import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { UsersController } from '../../controllers/users/users'
import { isAuthenticated, isTutor } from '@application/middlewares'

export const usersRoutes: Route[] = [
	{
		path: '/users/users/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.getUsers(req)
				}
			})
		]
	},
	{
		path: '/users/users/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.findUser(req)
				}
			})
		]
	},
	{
		path: '/users/users/tutors/saved',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateUserTutors(req)
				}
			})
		]
	},
	{
		path: '/users/users/tutors/subjects',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await UsersController.updateTutorSubjects(req)
				}
			})
		]
	}
]