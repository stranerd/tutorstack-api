import { Route } from '@stranerd/api-commons'
import authRoutes from './auth'
import notificationRoutes from './notifications'
import questionRoutes from './questions'
import usersRoutes from './users'
import paymentRoutes from './payment'
import sessionsRoutes from './sessions'
import interactionRoutes from './interactions'

export const routes: Route[] = [
	...authRoutes,
	...notificationRoutes,
	...questionRoutes,
	...usersRoutes,
	...paymentRoutes,
	...sessionsRoutes,
	...interactionRoutes
]