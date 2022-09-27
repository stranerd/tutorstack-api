import { UserRepository } from './data/repositories/users'
import { EducationRepository } from './data/repositories/educations'
import { WorkRepository } from './data/repositories/works'
import { SessionRepository } from './data/repositories/sessions'
import { UsersUseCase } from './domain/useCases/users'
import { EducationsUseCase } from './domain/useCases/educations'
import { WorksUseCase } from './domain/useCases/works'
import { SessionsUseCase } from './domain/useCases/sessions'

const userRepository = UserRepository.getInstance()
const educationRepository = EducationRepository.getInstance()
const workRepository = WorkRepository.getInstance()
const sessionRepository = SessionRepository.getInstance()

export const UsersUseCases = new UsersUseCase(userRepository)
export const EducationsUseCases = new EducationsUseCase(educationRepository)
export const WorksUseCases = new WorksUseCase(workRepository)
export const SessionsUseCases = new SessionsUseCase(sessionRepository)

export { UserFromModel } from './data/models/users'
export { EducationFromModel } from './data/models/educations'
export { WorkFromModel } from './data/models/works'
export { SessionFromModel } from './data/models/sessions'
export { UserEntity } from './domain/entities/users'
export { EducationEntity } from './domain/entities/educations'
export { WorkEntity } from './domain/entities/works'
export { SessionEntity } from './domain/entities/sessions'
export { UserBio, UserRoles, EmbeddedUser, UserMeta } from './domain/types'