import { ErrorRepository } from './data/repositories/errors'
import { TokenRepository } from './data/repositories/tokens'
import { EmailsUseCase } from './domain/useCases/emails'
import { TokensUseCase } from './domain/useCases/tokens'

const errorRepository = ErrorRepository.getInstance()
const tokenRepository = TokenRepository.getInstance()

export const EmailsUseCases = new EmailsUseCase(errorRepository)
export const TokensUseCases = new TokensUseCase(tokenRepository)

export { ErrorFromModel } from './data/models/errors'
export { TokenFromModel } from './data/models/tokens'
export { ErrorEntity } from './domain/entities/errors'
export { TokenEntity } from './domain/entities/tokens'