import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';

// Import endpoints
import classRoutes from './routes/classes';
import collectRoutes from './routes/collect';

let port = 8080;
let app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/classes', classRoutes);
app.use('/', collectRoutes);

app.listen(port, () => {
    console.log('The magic happens on port ' + port + '.');
});