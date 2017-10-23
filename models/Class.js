import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let classSchema = Schema({
    name: String,
    instructor: {type: String, ref: 'Person'},
    students: [{type: String, ref: 'Person'}]
});

export default mongoose.model('Class', classSchema);