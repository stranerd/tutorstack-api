import { answersRoutes } from './answers'
import { questionsRoutes } from './questions'

export default [
	...answersRoutes,
	...questionsRoutes
]