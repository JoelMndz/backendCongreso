import {Schema, model} from 'mongoose';

const registerSchema = new Schema({
  typePayment:{
    type: String,
    enum: ['efective','transfer']
  },
  status:{
    type: String,
    enum: ['paid','pending','reject'],
    default: 'pending'
  },
  inscriptions: [
    {
      attendanceDate:{
          type: Date,
          default: null
      },
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