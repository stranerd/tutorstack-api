import '@utils/types/enums'
import { EmailsList, getEnvOrFail, Instance } from '@stranerd/api-commons'

const useSSL = parseInt(getEnvOrFail('USE_SSL'))
export const baseDomain = `http${useSSL ? 's' : ''}://` + getEnvOrFail('BASE_DOMAIN')
export const environment = getEnvOrFail('ENVIRONMENT')
export const isDev = environment === 'local'

export const port = parseInt(getEnvOrFail('PORT'))
export const appId = getEnvOrFail('APP_ID')

export const superAdminEmail = getEnvOrFail('SUPER_ADMIN')

const mails = JSON.parse(getEnvOrFail('EMAILS') || '{}')
export const emails = Object.fromEntries(
	Object.entries(EmailsList).map(([key, value]) => [value, {
		privateKey: mails[key.toLowerCase()]?.private_key,
		clientId: mails[key.toLowerCase()]?.client_id
	}])
)

const braintree = JSON.parse(getEnvOrFail('BRAINTREE') || '{}')
export const braintreeConfig = {
	privateKey: braintree.privateKey,
	publicKey: braintree.publicKey,
	merchantId: braintree.merchantId,
	isProd: braintree.isProd
}

export const accessTokenKey = getEnvOrFail('ACCESS_TOKEN_KEY')
export const refreshTokenKey = getEnvOrFail('REFRESH_TOKEN_KEY')
export const mongoDbURI = getEnvOrFail('MONGODB_URI')
export const rabbitURI = getEnvOrFail('RABBITMQ_URI')
export const redisURI = getEnvOrFail('REDIS_URI')

Instance.initialize({
	accessTokenKey, refreshTokenKey,
	mongoDbURI, rabbitURI, redisURI,
	isDev, appId,
	bullQueueName: 'tutorstack-task-queues',
	rabbitColumnName: 'Tutorstack'
})
export const appInstance = Instance.getInstance()

const ms100 = JSON.parse(getEnvOrFail('100MS') || '{}')
export const ms100Config = {
	templateId: ms100.templateId,
	region: ms100.region,
	accessKey: ms100.accessKey,
	appSecret: ms100.appSecret
}