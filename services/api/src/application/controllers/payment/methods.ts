import { MethodsUseCases } from '@modules/payment'
import { BadRequestError, NotAuthorizedError, QueryParams, Request, validate, Validation } from '@stranerd/api-commons'
import { BraintreePayment } from '@utils/modules/payment/braintree'

export class MethodsController {
	static async getTokens (_: Request) {
		return { clientToken: await BraintreePayment.generateToken() }
	}

	static async find (req: Request) {
		const method = await MethodsUseCases.find(req.params.id)
		if (!method || method.userId !== req.authUser!.id) return null
		return method
	}

	static async get (req: Request) {
		const query = req.query as QueryParams
		query.auth = [{ field: 'userId', value: req.authUser!.id }]
		return await MethodsUseCases.get(query)
	}

	static async makePrimary (req: Request) {
		const updated = await MethodsUseCases.makePrimary({ id: req.params.id, userId: req.authUser!.id })
		if (updated) return updated
		throw new NotAuthorizedError()
	}

	static async delete (req: Request) {
		const isDeleted = await MethodsUseCases.delete({ id: req.params.id, userId: req.authUser!.id })
		if (isDeleted) return isDeleted
		throw new NotAuthorizedError()
	}

	static async create (req: Request) {
		const { nonce } = validate({
			nonce: req.body.nonce
		}, {
			nonce: {
				required: true,
				rules: [Validation.isString, Validation.isLongerThanX(0)]
			}
		})

		const methodModel = await BraintreePayment.createPaymentMethod(req.authUser!.id, nonce)
			.catch(() => {
				throw new BadRequestError('invalid nonce')
			})
		if (!methodModel) throw new BadRequestError('unsupported payment method')
		return await MethodsUseCases.create(methodModel)
	}
}