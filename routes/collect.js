import crypto from 'crypto';
import express from 'express';

import { Client } from '@microsoft/microsoft-graph-client';

import Class from '../models/Class';
import Session from '../models/Session';

const DELAY = 5000;
const URL_START = 0;
const URL_END = 6;
const SEED_START = 6;
const SEED_END = 36;
const NUM_START = 36;
const NUM_END = 64;

let activeSessions = {};    // classId: { ...session info... }
/* 
 * classId: {
 *   instructor: String
 *   currentHash: 688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6,
 *   session: {
 *     classId: ObjectId,
 *     startTime: new Date(),
 *     endTime: new Date(),
 *     students: []
 *   },
 *   interval: new setInterval()
 * }
*/
let hashBridge = {};        // hash : classId

let router = express.Router();

router.post('/collect/:id/start', (req, res) => {
    let client = Client.init({
        authProvider: done => {
            done(null, req.header('Authorization'))
        }
    });

    client
        .api('/me')
        .get((err, info) => {
            if (err || !info || info.id === undefined) {
                res.sendStatus(401);
            } else {
                let classId = req.params.id;
                let seed = Math.random().toString(16).split('.')[1];

                activeSessions[classId] = {};
                activeSessions[classId].currentHash = calcHash(seed).slice(URL_START, URL_END);
                activeSessions[classId].instructor = info.id;
                activeSessions[classId].session = {
                    classId,
                    startTime: new Date(),
                    students: []
                }

                console.log(activeSessions[classId].currentHash);

                activeSessions[classId].interval = new setInterval(() => {
                    let pHash = activeSessions[classId].currentHash;
                    let newHash = calcHash(pHash.slice(SEED_START, SEED_END));

                    activeSessions[classId].currentHash = newHash;
                    
                    console.log(newHash.slice(URL_START, URL_END));

                    delete hashBridge[pHash];
                    hashBridge[newHash.slice(URL_START, URL_END)] = classId;
                }, DELAY);

                let r = {
                    seed,
                    delay: DELAY,
                    urlStart: URL_START,
                    urlEnd: URL_END,
                    seedStart: SEED_START,
                    seedEnd: SEED_END,
                    numStart: NUM_START,
                    numEnd: NUM_END
                }

                res.json(r);
            }
        });
});

router.post('/collect/:id/stop', (req, res) => {
    let client = Client.init({
        authProvider: done => {
            done(null, req.header('Authorization'))
        }
    });

    client
        .api('/me')
        .get((err, info) => {
            if (err || !info || info.id === undefined) {
                res.sendStatus(401);
            } else {
                let classId = req.params.id;
                
                if (activeSessions[classId].instructor === info.id) {
                    activeSessions[classId].session.endTime = new Date();
    
                    let session = new Session(activeSessions[classId].session);
                    session.save();

                    clearInterval(activeSessions[classId].interval);

                    delete hashBridge[activeSessions[classId].currentHash];
                    delete activeSessions[classId];
                }
            }
        });

    res.sendStatus(200);
});

router.post('/h/:hash', (req, res) => {
    let hash = req.params.hash;
    let classId = hashBridge[hash];
    let uuid = req.body.UserId;
console.log(req.body)
    if (!hashBridge[hash]) {
        res.sendStatus(404);
    } else {
        let s = activeSessions[hash]

        Class.findById(classId, (err, result) => {
            console.log(result.students, uuid);
            console.log(result.students.indexOf(uuid));
            if (result.students.indexOf(uuid) >= 0) {
                activeSessions[classId].session.students.push(uuid);
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        });
    }
});

export default router;

function calcHash(seed) {
    return crypto.createHash('sha256').update(seed).digest('hex');
}
