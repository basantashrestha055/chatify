import express from 'express';

const router = express.Router();

router.get('/sendmessage', (req, res) => {
  res.send('sendmessage');
});

export default router;
