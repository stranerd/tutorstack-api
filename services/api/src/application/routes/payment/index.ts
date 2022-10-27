import { transactionsRoutes } from './transactions'
import { methodsRoutes } from './methods'
import { plansRoutes } from './plans'
import { walletsRoutes } from './wallets'

export default [
	...transactionsRoutes,
	...methodsRoutes,
	...plansRoutes,
	...walletsRoutes
]