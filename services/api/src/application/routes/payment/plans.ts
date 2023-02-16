import { PlansController } from '@application/controllers/payment/plans'
import { makeController, Route, StatusCodes } from 'equipped'

export const plansRoutes: Route[] = [
	{
		path: '/payment/plans',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PlansController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/plans/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await PlansController.find(req)
				}
			})
		]
	}
]