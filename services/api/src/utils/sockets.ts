import { appInstance } from '@utils/environment'
import { OnJoinFn } from 'equipped'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel

	appInstance.listener.register('questions/answers', isOpen)
	appInstance.listener.register('questions/questions', isOpen)
	appInstance.listener.register('questions/subjects', isOpen)
	appInstance.listener.register('notifications/notifications', isMine)
	appInstance.listener.register('payment/methods', isMine)
	appInstance.listener.register('payment/plans', isOpen)
	appInstance.listener.register('payment/transactions', isMine)
	appInstance.listener.register('payment/wallets', isMine)
	appInstance.listener.register('users/educations', isOpen)
	appInstance.listener.register('users/users', isOpen)
	appInstance.listener.register('users/works', isOpen)
	appInstance.listener.register('sessions/sessions', isMine)
	appInstance.listener.register('sessions/availabilities', isOpen)
	appInstance.listener.register('sessions/reviews', isOpen)
	appInstance.listener.register('interactions/comments', isOpen)
	appInstance.listener.register('interactions/likes', isOpen)
	appInstance.listener.register('interactions/tags', isOpen)
	appInstance.listener.register('interactions/views', isOpen)
}