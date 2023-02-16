import { routes } from '@application/routes'
import { PlansUseCases } from '@modules/payment'
import { UsersUseCases } from '@modules/users'
import { appId, appInstance, port } from '@utils/environment'
import { subscribers } from '@utils/events'
import { startJobs } from '@utils/jobs'
import { plansList } from '@utils/modules/payment/plans'
import { registerSockets } from '@utils/sockets'

const start = async () => {
	await appInstance.startDbConnection()
	await Promise.all(
		Object.values(subscribers)
			.map(async (subscriber) => {
				await subscriber.subscribe()
			})
	)

	await registerSockets()
	await UsersUseCases.resetAllUsersStatus()
	await PlansUseCases.init(plansList)

	appInstance.listener.callers = {
		onConnect: async (userId, socketId) => {
			await UsersUseCases.updateUserStatus({ userId, socketId, add: true })
		},
		onDisconnect: async (userId, socketId) => {
			await UsersUseCases.updateUserStatus({ userId, socketId, add: false })
		}
	}

	const app = appInstance.server
	app.routes = routes
	await app.start(port)
	await appInstance.logger.success(`${appId} service has started listening on port`, port)
	await startJobs()
}

start().then()