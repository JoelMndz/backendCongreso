import {Schema, model} from 'mongoose';

const courseSchema = new Schema({
  title: String,
  description: String,
  photoURL: String,
  price: {
    type: Number,
    default: 0
  },
  congressPrice:{
    medico_especialista: Number,
    medico_general: Number,
    medico_rural: Number,
    profesional_salud: Number,
    estudiante: Number,
    ponencia_congreso_memorias: Number
  },
  type:{
    type: String,
    enum: ['workshop','congress']
  },
  startDate: Date,
  endDate: Date,
  certificateTemplateURL: String,
});

export const CourseModel = model('courses', courseSchema);