import { AvailabilityRepository } from './data/repositories/availabilities'
import { SessionRepository } from './data/repositories/sessions'
import { AvailabilitiesUseCase } from './domain/useCases/availabilities'
import { SessionsUseCase } from './domain/useCases/sessions'

const availabilityRepository = AvailabilityRepository.getInstance()
const sessionRepository = SessionRepository.getInstance()

export const AvailabilitiesUseCases = new AvailabilitiesUseCase(availabilityRepository)
export const SessionsUseCases = new SessionsUseCase(sessionRepository)

export { SessionFromModel } from './data/models/sessions'
export { AvailabilityFromModel } from './data/models/availabilities'
export { SessionEntity } from './domain/entities/sessions'
export { AvailabilityEntity } from './domain/entities/availabilities'