import { InteractionEntities } from '@modules/interactions'
import { QuestionsUseCases } from '@modules/questions'
import { BadRequestError } from 'equipped'

type Interactions = 'comments' | 'likes' | 'dislikes' | 'views'

const finders = {
	[InteractionEntities.questions]: async (id: string) => (await QuestionsUseCases.find(id))?.user.id
}

export const verifyInteractionEntity = async (type: InteractionEntities, id: string, interaction: Interactions) => {
	const types = (() => {
		if (interaction === 'comments') return [InteractionEntities.questions]
		if (interaction === 'likes') return []
		if (interaction === 'dislikes') return []
		if (interaction === 'views') return []
		return []
	})().reduce((acc, cur) => {
		acc[cur] = finders[cur]
		return acc
	}, {} as Record<InteractionEntities, (id: string) => Promise<string | undefined>>)

	const finder = types[type]
	if (!finder) throw new BadRequestError(`${interaction} not supported for ${type}`)
	const res = await finder(id)
	if (!res) throw new BadRequestError(`no ${type} with id ${id} found`)
	return res
}