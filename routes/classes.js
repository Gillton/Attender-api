import express from 'express';

import { Client } from '@microsoft/microsoft-graph-client';

import Class from '../models/Class';

let router = express.Router();

router.get('/', (req, res) => {
    let access_token = req.header('Authorization');
    let client = Client.init({
        debugLogging: true,
        authProvider: (done) => {
            done(null, access_token);
        }
    });

    client
        .api('/me')
        .select('id')
        .get((err, info) => {
            if (err) {
                res.sendStatus(401);
            } else {
                Class.find({ instructor: info.id }, (err, classes) => {
                    if (err)
                        console.log(err);
                    res.json(classes);
                });
            }
        });
});

router.get('/:id', (req, res) => {
    res.sendStatus(200);
});

export default router;