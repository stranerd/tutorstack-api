import { TokenEntity, TokenFromModel } from '@modules/notifications'
import { DbChangeCallbacks } from 'equipped'

export const TokenDbChangeCallbacks: DbChangeCallbacks<TokenFromModel, TokenEntity> = {}