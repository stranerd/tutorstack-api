export enum AuthRole {
	isAdmin = 'isAdmin',
	isTutor = 'isTutor',
	isSuperAdmin = 'isSuperAdmin',
}

export type AuthRoles = Partial<Record<AuthRole, boolean>>