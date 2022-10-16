import { OnJoinFn } from '@stranerd/api-commons'
import { getSocketEmitter } from '@index'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel

	getSocketEmitter().register('questions/answers', isOpen)
	getSocketEmitter().register('questions/questions', isOpen)
	getSocketEmitter().register('questions/subjects', isOpen)
	getSocketEmitter().register('notifications/notifications', isMine)
	getSocketEmitter().register('payment/methods', isMine)
	getSocketEmitter().register('payment/transactions', isMine)
	getSocketEmitter().register('payment/wallets', isMine)
	getSocketEmitter().register('users/educations', isOpen)
	getSocketEmitter().register('users/users', isOpen)
	getSocketEmitter().register('users/works', isOpen)
	getSocketEmitter().register('sessions/sessions', isMine)
	getSocketEmitter().register('sessions/availabilities', isOpen)
	getSocketEmitter().register('sessions/reviews', isOpen)
	getSocketEmitter().register('interactions/comments', isOpen)
	getSocketEmitter().register('interactions/likes', isOpen)
	getSocketEmitter().register('interactions/tags', isOpen)
	getSocketEmitter().register('interactions/views', isOpen)
}