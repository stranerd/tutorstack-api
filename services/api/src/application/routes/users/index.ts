import { usersRoutes } from './users'
import { tutorsRoutes } from './tutors'
import { educationsRoutes } from './educations'
import { sessionsRoutes } from './sessions'
import { worksRoutes } from './works'

export default [
	...usersRoutes,
	...tutorsRoutes,
	...educationsRoutes,
	...sessionsRoutes,
	...worksRoutes
]