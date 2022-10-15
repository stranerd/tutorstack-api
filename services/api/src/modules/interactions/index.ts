import { CommentRepository } from './data/repositories/comments'
import { LikeRepository } from './data/repositories/likes'
import { ViewRepository } from './data/repositories/views'
import { TagRepository } from './data/repositories/tags'
import { CommentsUseCase } from './domain/useCases/comments'
import { LikesUseCase } from './domain/useCases/likes'
import { ViewsUseCase } from './domain/useCases/views'
import { TagsUseCase } from './domain/useCases/tags'

const commentRepository = CommentRepository.getInstance()
const likeRepository = LikeRepository.getInstance()
const viewRepository = ViewRepository.getInstance()
const tagRepository = TagRepository.getInstance()

export const CommentsUseCases = new CommentsUseCase(commentRepository)
export const LikesUseCases = new LikesUseCase(likeRepository)
export const ViewsUseCases = new ViewsUseCase(viewRepository)
export const TagsUseCases = new TagsUseCase(tagRepository)

export { CommentFromModel } from './data/models/comments'
export { LikeFromModel } from './data/models/likes'
export { ViewFromModel } from './data/models/views'
export { TagFromModel } from './data/models/tags'
export { CommentEntity } from './domain/entities/comments'
export { LikeEntity } from './domain/entities/likes'
export { ViewEntity } from './domain/entities/views'
export { TagEntity } from './domain/entities/tags'
export { InteractionEntities, CommentMetaType, TagTypes } from './domain/types'