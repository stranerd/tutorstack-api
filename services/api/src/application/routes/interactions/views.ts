import { isAuthenticated } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'
import { ViewsController } from '../../controllers/interactions/views'

export const viewsRoutes: Route[] = [
	{
		path: '/interactions/views/',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ViewsController.getViews(req)
				}
			})
		]
	},
	{
		path: '/interactions/views/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ViewsController.findView(req)
				}
			})
		]
	},
	{
		path: '/interactions/views/',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await ViewsController.createView(req)
				}
			})
		]
	}
]