import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let personSchema = Schema({
    _id: String,
    name: String
});

export default mongoose.model('Person', personSchema);