import jwt from 'jsonwebtoken'
import { Random } from '@stranerd/api-commons'
import { ms100Config } from '@utils/environment'
import axios from 'axios'

const { appSecret, accessKey, templateId, region } = ms100Config

const axiosInstance = axios.create({
	baseURL: 'https://api.100ms.live/v2'
})

export class Ms100Live {
	static async getRoomToken (data: { sessionId: string, userId: string, userName: string, isTutor: boolean, expiresIn: number }) {
		const { sessionId, userName, userId, isTutor, expiresIn } = data
		const roomId = await Ms100Live.createRoom(sessionId)
		const authToken = jwt.sign({
			access_key: accessKey,
			room_id: roomId,
			user_id: userId,
			role: isTutor ? 'session-tutor' : 'session-member',
			type: 'app',
			version: 2,
			iat: Math.floor(Date.now() / 1000),
			nbf: Math.floor(Date.now() / 1000)
		}, appSecret, {
			algorithm: 'HS256',
			expiresIn,
			jwtid: Random.string(24)
		})
		return { authToken, userName, roomId }
	}

	static async createRoom (sessionId: string) {
		const { data } = await axiosInstance.post('/rooms', {
			name: sessionId,
			description: 'Room Description',
			template_id: templateId,
			region
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer: ${await Ms100Live.getManagementToken()}`
			}
		})
		return data.id
	}

	static async endRoom (sessionId: string) {
		const roomId = await Ms100Live.createRoom(sessionId)
		const { data } = await axiosInstance.post(`/rooms/${roomId}`, {
			enabled: false
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer: ${await Ms100Live.getManagementToken()}`
			}
		})
		return data.enabled
	}

	private static async getManagementToken () {
		return jwt.sign({
			access_key: accessKey,
			type: 'management',
			version: 2,
			iat: Math.floor(Date.now() / 1000),
			nbf: Math.floor(Date.now() / 1000)
		}, appSecret, {
			algorithm: 'HS256',
			expiresIn: '24h',
			jwtid: Random.string(24)
		})
	}
}