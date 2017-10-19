import express from 'express';

let router = express.Router();

router.post('/collect/:id/start', (req, res) => {
    res.sendStatus(200);
});

router.post('/collect/:id/stop', (req, res) => {
    res.sendStatus(200);
});

router.post('/h/:hash', (req, res) => {
    res.sendStatus(200);
});

export default router;