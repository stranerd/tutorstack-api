export { EmbeddedUser } from '@modules/users'

import { MediaOutput } from 'equipped'

export type Media = MediaOutput

export type QuestionHeld = {
	userId: string
	heldAt: number
	releasedAt: number
} | null

export const MAX_ANSWERS_COUNT = 1

export enum QuestionMetaType {
	comments = 'comments'
}

export type QuestionMeta = Record<QuestionMetaType, number>
