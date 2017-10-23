import express from 'express';

import { Client } from '@microsoft/microsoft-graph-client';

import Class from '../models/Class';
import Person from '../models/Person'

let router = express.Router();

router.get('/', (req, res) => {
    let access_token = req.header('Authorization');
    let client = Client.init({
        debugLogging: true,
        authProvider: (done) => {
            done(null, access_token);
        }
    });

    // let p = new Person({
    //     _id: '7d267061-961d-482e-9332-ca3d925650a8',
    //     name: 'Adam Eaton'
    // });
    // p.save((err, prsn) => {

    // })
    // c.save((err, t) => {

    // });

    client
        .api('/me')
        .select('id')
        .get((err, info) => {
            if (err) {
                res.sendStatus(401);
            } else {
                Class.find({ instructor: info.id }, (err, classes) => {
                    Class.populate(classes, {path: 'instructor'}, (err, classes) => {
                        if (err)
                            console.log(err);
                        res.json(classes);
                    });
                });
            }
        });
});

router.get('/:id', (req, res) => {
    res.sendStatus(200);
});

export default router;