import { availabilitiesRoutes } from './availabilities'
import { sessionsRoutes } from './sessions'
import { reviewsRoutes } from './reviews'

export default [
	...sessionsRoutes,
	...reviewsRoutes,
	...availabilitiesRoutes
]