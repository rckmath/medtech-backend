import express from 'express';
import Constants from '../utils/constants';

const router = express.Router();
const startedAt = Date.now();

router.use('/user', require('./controllers/user-controller').default);

export default router;
