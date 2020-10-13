import express from 'express';
import Constants from '../utils/constants';
import { msToTime } from '../utils/tools';

const router = express.Router();
const startedAt = Date.now();

router.get('/status',
  async (req, res) => res.json({
    env: Constants.env,
    uptime: msToTime(Date.now() - startedAt),
  }));

router.use('/user', require('./controllers/user').default);
router.use('/auth', require('./controllers/auth').default);
router.use('/medic', require('./controllers/medic').default);

export default router;
