import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let classSchema = Schema({
    name: String,
    instructor: String,
    students: [{type: Schema.Types.ObjectId, ref: 'Person'}]
});

export default mongoose.model('Class', classSchema);