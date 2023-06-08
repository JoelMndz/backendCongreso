import {Schema, model} from 'mongoose';

import { METHOD_PAYMENT, STATUS_REGISTER } from '../constants';

const registerSchema = new Schema({
  typePayment:{
    type: String,
    enum: [METHOD_PAYMENT.EFECTIVE,METHOD_PAYMENT.TRANSFER]
  },
  status:{
    type: String,
    enum: [STATUS_REGISTER.PAID,STATUS_REGISTER.PENDING,STATUS_REGISTER.REJECT],
    default: STATUS_REGISTER.PENDING
  },
  inscriptions: [
    {
      attendanceDate:[{
        type: [String],
        default: []
      }],
      certificateURL: {
          type: String,
          default: null
      },
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'courses'
      }
    }
  ],
  userId:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  qr: String,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  voucherURL: String,
});

export const RegisterModel = model('registers', registerSchema);