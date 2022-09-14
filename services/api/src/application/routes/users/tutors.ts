import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { TutorsController } from '../../controllers/users/tutors'

export const tutorsRoutes: Route[] = [
	{
		path: '/users/tutors/save',
		method: 'post',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await TutorsController.saveTutors(req)
				}
			})
		]
	}
]