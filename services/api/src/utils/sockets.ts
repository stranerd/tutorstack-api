import { OnJoinFn } from '@stranerd/api-commons'
import { getSocketEmitter } from '@index'

export const registerSockets = () => {
	/* const isAdmin: OnJoinFn = async ({
		                                 user,
		                                 channel
	                                 }) => user?.roles?.[SupportedAuthRoles.isAdmin] ? channel : null
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null */
	const isOpen: OnJoinFn = async ({ channel }) => channel

	getSocketEmitter().register('questions/answers', isOpen)
	getSocketEmitter().register('questions/questions', isOpen)
	getSocketEmitter().register('questions/subjects', isOpen)
	getSocketEmitter().register('users/users', isOpen)
}