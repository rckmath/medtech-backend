import express from 'express';
import Constants from '../../utilities/constants';

const router = express.Router();
const startedAt = Date.now();

router.get('/status',
  async (req, res) => res.json({
    hello_world: "Alô!", 
  }));

export default router;
