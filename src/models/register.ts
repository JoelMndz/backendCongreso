import {Schema, model} from 'mongoose';

const registerSchema = new Schema({
  typePayment:{
    type: String,
    enum: ['efective','transfer']
  },
  status:{
    type: String,
    enum: ['paid','pending','reject']
  },
  inscriptions: [
    {
        _id: Schema.Types.ObjectId,
        attendanceDate:{
            type: Date,
            default: null
        },
        certificateURL: {
            type: String,
            default: null
        },

    }
  ],
  userId:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  qr: String,
  total: Number,
  createdAt: Date,
  voucherURL: String,
});

export const RegisterModel = model('registers', registerSchema);