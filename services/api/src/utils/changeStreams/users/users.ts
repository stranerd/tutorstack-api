import { NotificationType } from '@modules/notifications'
import { AnswersUseCases, QuestionsUseCases } from '@modules/questions'
import { ReviewsUseCases, SessionsUseCases } from '@modules/sessions'
import { UserEntity, UserFromModel, UserMeta, UsersUseCases } from '@modules/users'
import { appInstance } from '@utils/environment'
import { sendNotification } from '@utils/modules/notifications/notifications'
import { AuthRole, DbChangeCallbacks } from 'equipped'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('users/users', after)
		await appInstance.listener.created(`users/users/${after.id}`, after)
	},
	updated: async ({ after, before, changes }) => {
		await appInstance.listener.updated('users/users', after)
		await appInstance.listener.updated(`users/users/${after.id}`, after)
		if (changes.roles?.[AuthRole.isTutor]) {
			const upgraded = after.roles[AuthRole.isTutor]
			if (!upgraded) await UsersUseCases.removeSavedTutors(before.id)
			await sendNotification([after.id], {
				title: 'Tutoring role updated',
				body: upgraded ? 'You have been upgraded to a tutor' : 'You have been demoted from tutoring',
				sendEmail: true, data: { type: NotificationType.RoleUpdated }
			})
		}
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			QuestionsUseCases, AnswersUseCases, SessionsUseCases, ReviewsUseCases
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))
		if (changes.tutors) {
			const added = after.tutors.filter((t) => !before.tutors.includes(t))
			const removed = before.tutors.filter((t) => !after.tutors.includes(t))
			await Promise.all([
				UsersUseCases.incrementMeta({ ids: added, value: 1, property: UserMeta.students }),
				UsersUseCases.incrementMeta({ ids: removed, value: -1, property: UserMeta.students })
			])
		}
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/users', before)
		await appInstance.listener.deleted(`users/users/${before.id}`, before)
	}
}