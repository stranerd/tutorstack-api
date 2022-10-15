export { EmbeddedUser } from '@modules/users'

export enum InteractionEntities {
	questions = 'questions'
}

export type InteractionEntity = {
	type: InteractionEntities
	id: string
}

export enum CommentMetaType {
	comments = 'comments'
}

export type CommentMeta = Record<CommentMetaType, number>

export enum TagTypes {
	none = 'none'
}