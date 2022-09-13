export enum NotificationType {
	NewAnswer = 'NewAnswer'
}

export type NotificationData = { type: NotificationType.NewAnswer, questionId: string, answerId: string }
