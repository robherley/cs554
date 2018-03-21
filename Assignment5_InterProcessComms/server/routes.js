const router = require('express').Router;
const redisConnection = require('../redis/redis-connection');
const nrpSender = require('../redis/nrp-sender-shim');

// GET /api/people/:id
router.get('/api/people/id', async (req, res) => {
  // send api msg
});

// POST /api/people
router.post('/api/people', async (req, res) => {
  // send post msg
});

// DELETE /api/people/:id
router.delete('/api/people/:id', async (req, res) => {
  // send delete msg
});

// PUT /api/people/:id
router.put('/api/people/:id', async (req, res) => {
  // send put msg
});

module.exports = router;
