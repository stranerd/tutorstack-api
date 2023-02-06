import { makeEnum } from '@stranerd/api-commons'

const Ar = makeEnum('AuthRole', {
	isAdmin: 'isAdmin',
	isTutor: 'isTutor',
	isSuperAdmin: 'isSuperAdmin'
} as const)

const El = makeEnum('EmailsList', {
	NO_REPLY: 'no-reply@stranerd.com'
} as const)

const Ev = makeEnum('EventTypes', {
	SENDMAIL: 'SENDMAIL',
	SENDTEXT:'SENDTEXT',
	DELETEFILE: 'DELETEFILE'
} as const)

const Dj = makeEnum('DelayedJobs', {
	HoldQuestion: 'HoldQuestion',
	CloseSession: 'CloseSession',
	RenewSubscription: 'RenewSubscription'
} as const)

declare module '@stranerd/api-commons/lib/enums/types' {
	type TAr = typeof Ar
	type TEl = typeof El
	type TEv = typeof Ev
	type TDj = typeof Dj
    interface IAuthRole extends TAr {}
    interface IEmailsList extends TEl {}
    interface IEventTypes extends TEv {}
    interface IDelayedJobs extends TDj {}
}