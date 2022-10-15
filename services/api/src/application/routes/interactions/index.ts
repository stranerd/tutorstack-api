import { commentsRoutes } from './comments'
import { likesRoutes } from './likes'
import { tagsRoutes } from './tags'
import { viewsRoutes } from './views'

export default [
	...commentsRoutes,
	...likesRoutes,
	...tagsRoutes,
	...viewsRoutes
]