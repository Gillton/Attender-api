import mongoose from 'mongoose';

import Class from './Class';
import Person from './Person';

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connect('mongodb://@localhost/attender', { useMongoClient: true});
mongoose.Promise = global.Promise;
