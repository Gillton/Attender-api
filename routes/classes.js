import express from 'express';

let router = express.Router();

router.get('/', (req, res) => {
    res.sendStatus(200);
});

router.get('/:id', (req, res) => {
    res.sendStatus(200);
});

export default router;