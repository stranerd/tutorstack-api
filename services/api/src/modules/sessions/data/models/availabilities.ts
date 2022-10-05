import { Booked } from '../../domain/types'

export interface AvailabilityFromModel extends AvailabilityToModel {
	_id: string
	free: number[]
	booked: Booked[]
	createdAt: number
	updatedAt: number
}

export interface AvailabilityToModel {
	userId: string
}
