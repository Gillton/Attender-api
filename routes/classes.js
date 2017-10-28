import express from 'express';

import { Client } from '@microsoft/microsoft-graph-client';

import Class from '../models/Class';
import Person from '../models/Person';

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
                    Class.populate(classes, { path: 'instructor' }, (err, classes) => {
                        if (err)
                            console.log(err);
                        res.json(classes);
                    });
                });
            }
        });
});

// New and Edit endpoint
router.put('/:id', (req, res) => {
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
                let classId = req.params.id;
                let newClass = req.body;

                if (classId === 'new') {

                    console.log(newClass);
                    delete newClass._id;
                    newClass.instructor._id = info.id;

                    let c = new Class(newClass);

                    c.save((err, c) => {
                        if (err)
                            console.log(err)
                        Class.populate(c, { path: 'instructor' }, (err, c) => {
                            if (err)
                                console.log(err);
                            res.json(c);
                        });
                    });

                } else {
                    Class.update({ _id: classId }, newClass, (err, c) => {
                        if (err)
                            console.log(err);
                        res.json(newClass);
                    });
                }
            }
        });
});

router.delete('/:id', (req, res) => {
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
                let classId = req.params.id;
                let newClass = req.body;

                Class.find({_id: classId}).remove().exec((err, c) => {
                    if (err)
                        console.log(err);
                    res.json(classId);
                });

            }
        });
});

router.get('/:id', (req, res) => {
    res.sendStatus(200);
});

export default router;