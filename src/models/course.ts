import {Schema, model} from 'mongoose';

const courseSchema = new Schema({
  title: String,
  description: String,
  photoURL: String,
  price: Number,
  type:{
    type: String,
    enum: ['workshop','congress']
  },
  startDate: Date,
  endDate: Date,
  certificateTemplateURL: String,
});

export const CourseModel = model('courses', courseSchema);