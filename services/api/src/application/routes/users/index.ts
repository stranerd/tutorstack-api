import { usersRoutes } from './users'
import { educationsRoutes } from './educations'
import { worksRoutes } from './works'

export default [
	...usersRoutes,
	...educationsRoutes,
	...worksRoutes
]