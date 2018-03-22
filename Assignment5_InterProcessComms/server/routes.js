const router = require('express').Router();
const { sendMessage } = require('../redis/nrp-sender-shim');

const handleError = (req, res, err) => {
  const { originalUrl, params } = req;
  const { info, code } = err;
  res.status(500).json({
    error: info || 'An internal server error has occurred.',
    code: code || 500,
    originalUrl,
    params
  });
};

// GET /api/people/:id
router.get('/api/people/:id', async (req, res) => {
  try {
    const msg = await sendMessage({
      eventName: 'get',
      data: {
        id: req.params.id
      }
    });
    res.json(msg);
  } catch (e) {
    handleError(req, res, e);
  }
});

// POST /api/people
router.post('/api/people', async (req, res) => {
  try {
    const msg = await sendMessage({
      eventName: 'post',
      data: {
        body: req.body
      }
    });
    res.json(msg);
  } catch (e) {
    handleError(req, res, e);
  }
});

// DELETE /api/people/:id
router.delete('/api/people/:id', async (req, res) => {
  try {
    const msg = await sendMessage({
      eventName: 'delete',
      data: {
        id: req.params.id
      }
    });
    res.json(msg);
  } catch (e) {
    handleError(req, res, e);
  }
});

// PUT /api/people/:id
router.put('/api/people/:id', async (req, res) => {
  try {
    const msg = await sendMessage({
      eventName: 'put',
      data: {
        id: req.params.id,
        body: req.body
      }
    });
    res.json(msg);
  } catch (e) {
    handleError(req, res, e);
  }
});

module.exports = router;
