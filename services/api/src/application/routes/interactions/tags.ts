import { isAdmin } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'
import { TagController } from '../../controllers/interactions/tags'

export const tagsRoutes: Route[] = [
	{
		path: '/interactions/tags',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.GetTags(req)
				}
			})
		]
	},
	{
		path: '/interactions/tags/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.FindTag(req)
				}
			})
		]
	},
	{
		path: '/interactions/tags/:id',
		method: 'put',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.UpdateTag(req)
				}
			})
		]
	},
	{
		path: '/interactions/tags',
		method: 'post',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.CreateTag(req)
				}
			})
		]
	},
	{
		path: '/interactions/tags/:id',
		method: 'delete',
		controllers: [
			isAdmin,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TagController.DeleteTag(req)
				}
			})
		]
	}
]