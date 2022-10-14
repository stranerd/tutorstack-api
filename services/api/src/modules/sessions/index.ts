import { AvailabilityRepository } from './data/repositories/availabilities'
import { SessionRepository } from './data/repositories/sessions'
import { ReviewRepository } from './data/repositories/reviews'
import { AvailabilitiesUseCase } from './domain/useCases/availabilities'
import { SessionsUseCase } from './domain/useCases/sessions'
import { ReviewsUseCase } from './domain/useCases/reviews'

const availabilityRepository = AvailabilityRepository.getInstance()
const sessionRepository = SessionRepository.getInstance()
const reviewRepository = ReviewRepository.getInstance()

export const AvailabilitiesUseCases = new AvailabilitiesUseCase(availabilityRepository)
export const SessionsUseCases = new SessionsUseCase(sessionRepository)
export const ReviewsUseCases = new ReviewsUseCase(reviewRepository)

export { SessionFromModel } from './data/models/sessions'
export { AvailabilityFromModel } from './data/models/availabilities'
export { ReviewFromModel } from './data/models/reviews'
export { SessionEntity } from './domain/entities/sessions'
export { AvailabilityEntity } from './domain/entities/availabilities'
export { ReviewEntity } from './domain/entities/reviews'