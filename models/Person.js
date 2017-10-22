import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let personSchema = Schema({
    name: String,
    uuid: String
});

export default mongoose.model('Person', personSchema);