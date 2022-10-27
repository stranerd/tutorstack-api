import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { PlansController } from '@application/controllers/payment/plans'

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