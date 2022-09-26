import { makeController, Route, StatusCodes } from '@stranerd/api-commons'
import { EducationController } from '../../controllers/users/educations'
import { isAuthenticated, isTutor } from '@application/middlewares'

export const educationsRoutes: Route[] = [
	{
		path: '/users/educations',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.GetEducations(req)
				}
			})
		]
	},
	{
		path: '/users/educations/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.FindEducation(req)
				}
			})
		]
	},
	{
		path: '/users/educations/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.UpdateEducation(req)
				}
			})
		]
	},
	{
		path: '/users/educations',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.CreateEducation(req)
				}
			})
		]
	},
	{
		path: '/users/educations/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await EducationController.DeleteEducation(req)
				}
			})
		]
	}
]