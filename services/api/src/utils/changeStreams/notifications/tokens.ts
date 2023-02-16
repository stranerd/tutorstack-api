import { TokenEntity, TokenFromModel } from '@modules/notifications'
import { ChangeStreamCallbacks } from 'equipped'

export const TokenChangeStreamCallbacks: ChangeStreamCallbacks<TokenFromModel, TokenEntity> = {}