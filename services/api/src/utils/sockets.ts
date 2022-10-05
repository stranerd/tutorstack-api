import { OnJoinFn } from '@stranerd/api-commons'
import { getSocketEmitter } from '@index'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel

	getSocketEmitter().register('questions/answers', isOpen)
	getSocketEmitter().register('questions/questions', isOpen)
	getSocketEmitter().register('questions/subjects', isOpen)
	getSocketEmitter().register('notifications/notifications', isMine)
	getSocketEmitter().register('payment/cards', isMine)
	getSocketEmitter().register('payment/transactions', isMine)
	getSocketEmitter().register('payment/wallets', isMine)
	getSocketEmitter().register('as/educations', isOpen)
	getSocketEmitter().register('as/as', isOpen)
	getSocketEmitter().register('as/works', isOpen)
	getSocketEmitter().register('users/users', isMine)
	getSocketEmitter().register('users/availabilities', isOpen)
}