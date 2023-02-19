import { TransactionDbChangeCallbacks } from '@utils/changeStreams/payment/transactions'
import { appInstance } from '@utils/environment'
import { mongoose } from 'equipped'
import { TransactionEntity } from '../../domain/entities/transactions'
import { TransactionMapper } from '../mappers/transactions'
import { TransactionFromModel } from '../models/transactions'

const TransactionSchema = new mongoose.Schema<TransactionFromModel>({
	_id: {
		type: String,
		default: () => new mongoose.Types.ObjectId().toString()
	},
	userId: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	status: {
		type: mongoose.Schema.Types.Mixed,
		required: true
	},
	data: {
		type: mongoose.Schema.Types.Mixed as unknown as TransactionFromModel['data'],
		required: true
	},
	createdAt: {
		type: Number,
		required: false,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		required: false,
		default: Date.now
	}
}, { timestamps: { currentTime: Date.now }, minimize: false })

export const Transaction = mongoose.model<TransactionFromModel>('PaymentTransaction', TransactionSchema)

export const TransactionChange = appInstance.db
	.generateDbChange<TransactionFromModel, TransactionEntity>(Transaction, TransactionDbChangeCallbacks, new TransactionMapper().mapFrom)