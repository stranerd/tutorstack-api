import { availabilitiesRoutes } from './availabilities'
import { sessionsRoutes } from './sessions'

export default [
	...sessionsRoutes,
	...availabilitiesRoutes
]