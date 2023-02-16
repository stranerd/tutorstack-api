import { makeController, Route, StatusCodes } from 'equipped'
import { IdentitiesController } from '../../controllers/auth/identities'

const googleSignIn: Route = {
	path: '/auth/identities/google',
	method: 'post',
	controllers: [
		makeController(async (req) => {
			return {
				status: StatusCodes.Ok,
				result: await IdentitiesController.googleSignIn(req)
			}
		})
	]
}

const routes: Route[] = [googleSignIn]
export default routes