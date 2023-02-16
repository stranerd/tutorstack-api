import { isAuthenticated, isTutor } from '@application/middlewares'
import { makeController, Route, StatusCodes } from 'equipped'
import { QuestionController } from '../../controllers/questions/questions'

export const questionsRoutes: Route[] = [
	{
		path: '/questions/questions',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await QuestionController.GetQuestion(req)
				}
			})
		]
	},
	{
		path: '/questions/questions/:id',
		method: 'get',
		controllers: [
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await QuestionController.FindQuestion(req)
				}
			})
		]
	},
	{
		path: '/questions/questions/:id',
		method: 'put',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await QuestionController.UpdateQuestion(req)
				}
			})
		]
	},
	{
		path: '/questions/questions',
		method: 'post',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await QuestionController.CreateQuestion(req)
				}
			})
		]
	},
	{
		path: '/questions/questions/:id',
		method: 'delete',
		controllers: [
			isAuthenticated,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await QuestionController.DeleteQuestion(req)
				}
			})
		]
	},
	{
		path: '/questions/questions/:id/hold',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await QuestionController.HoldQuestion(req)
				}
			})
		]
	},
	{
		path: '/questions/questions/:id/release',
		method: 'post',
		controllers: [
			isAuthenticated, isTutor,
			makeController(async (req) => {
				return {
					status: StatusCodes.Ok,
					result: await QuestionController.ReleaseQuestion(req)
				}
			})
		]
	}
]