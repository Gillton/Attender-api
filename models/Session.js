import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let sessionSchema = Schema({
    classId: {type: Schema.Types.ObjectId, ref: 'Class'},
    students: [{type: String, ref: 'Person'}],
    startTime: Date,
    endTime: Date
});

export default mongoose.model('Session', sessionSchema);