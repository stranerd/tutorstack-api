import { PlanRepository } from './data/repositories/plans'
import { TransactionRepository } from './data/repositories/transactions'
import { MethodRepository } from './data/repositories/methods'
import { WalletRepository } from './data/repositories/wallets'
import { PlansUseCase } from './domain/useCases/plans'
import { TransactionsUseCase } from './domain/useCases/transactions'
import { MethodsUseCase } from './domain/useCases/methods'
import { WalletsUseCase } from './domain/useCases/wallets'

const planRepository = PlanRepository.getInstance()
const transactionRepository = TransactionRepository.getInstance()
const methodRepository = MethodRepository.getInstance()
const walletRepository = WalletRepository.getInstance()

export const PlansUseCases = new PlansUseCase(planRepository)
export const TransactionsUseCases = new TransactionsUseCase(transactionRepository)
export const MethodsUseCases = new MethodsUseCase(methodRepository)
export const WalletsUseCases = new WalletsUseCase(walletRepository)

export { PlanFromModel, PlanToModel } from './data/models/plans'
export { TransactionFromModel } from './data/models/transactions'
export { MethodFromModel, MethodToModel } from './data/models/methods'
export { WalletFromModel } from './data/models/wallets'
export { PlanEntity } from './domain/entities/plans'
export { TransactionEntity } from './domain/entities/transactions'
export { MethodEntity } from './domain/entities/methods'
export { WalletEntity } from './domain/entities/wallets'
export {
	Currencies, TransactionType, TransactionStatus, PlanDataType, CurrencyCountries, MethodType
} from './domain/types'
