import { AuthUseCases } from '@modules/auth'
import { generateAuthOutput } from '@utils/modules/auth'
import { Request, Schema, validateReq } from 'equipped'

export class IdentitiesController {
	static async googleSignIn (req: Request) {
		const validatedData = validateReq({
			idToken: Schema.string(),
		}, req.body)

		const data = await AuthUseCases.googleSignIn(validatedData)
		return await generateAuthOutput(data)
	}
}