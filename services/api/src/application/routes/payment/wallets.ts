import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { WalletsController } from '@application/controllers/payment/wallets'
import { isAuthenticated } from '@application/middlewares'

export const walletsRoutes: Route[] = [
	{
		path: '/payment/wallets',
		method: 'get',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.get(req)
				}
			})
		]
	},
	{
		path: '/payment/wallets/fund',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.fund(req)
				}
			})
		]
	},
	{
		path: '/payment/wallets/subscriptions',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.subscribeToPlan(req)
				}
			})
		]
	},
	{
		path: '/payment/wallets/subscriptions',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await WalletsController.cancelSubscription(req)
				}
			})
		]
	}
]