import { isAuthenticated, isTutor } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'
import { WorkController } from '../../controllers/users/works'

export const worksRoutes: Route[] = [
	{
		path: '/users/works',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.GetWorks(req)
				}
			})
		]
	},
	{
		path: '/users/works/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.FindWork(req)
				}
			})
		]
	},
	{
		path: '/users/works/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.UpdateWork(req)
				}
			})
		]
	},
	{
		path: '/users/works',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.CreateWork(req)
				}
			})
		]
	},
	{
		path: '/users/works/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WorkController.DeleteWork(req)
				}
			})
		]
	}
]