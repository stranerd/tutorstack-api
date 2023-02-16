import { Route } from 'equipped'
import authRoutes from './auth'
import interactionRoutes from './interactions'
import notificationRoutes from './notifications'
import paymentRoutes from './payment'
import questionRoutes from './questions'
import sessionsRoutes from './sessions'
import usersRoutes from './users'

export const routes: Route[] = [
	...authRoutes,
	...notificationRoutes,
	...questionRoutes,
	...usersRoutes,
	...paymentRoutes,
	...sessionsRoutes,
	...interactionRoutes
]