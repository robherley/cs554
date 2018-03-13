const app = require('express')();
const { promisify } = require('util');
const dummyData = require('./people');
const client = require('redis').createClient();

// Bluebird is annoying with the callbacks, this is better imo
const redisAsync = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client),
  lpush: promisify(client.lpush).bind(client),
  ltrim: promisify(client.ltrim).bind(client),
  lrange: promisify(client.lrange).bind(client)
};

// In case redis decides to break
client.on('error', err => console.log('Redis Error:' + err));

/**
 * Given an id, reject or resolve with our dummy data
 * @async
 * @param {string} id person's id to find
 * @returns {Promise<Object>} The object of person
 */
const getById = id => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      dummyData[id - 1] // See if that person exists
        ? resolve(dummyData[id - 1]) // if they do resolve
        : reject(`Specified ID is not found or invalid (${id})`); // err if not
    }, 5000);
  });
};

/**
 * Simple function to add a person to our redis list and limit it to 20 persons
 * @param {string} personStr string of person object to add
 */
const pushRecent = async personStr => {
  await redisAsync.lpush('mostRecent', personStr);
  await redisAsync.ltrim('mostRecent', 0, 19);
};

// History route
app.use('/api/people/history', async (req, res) => {
  // Get all most recent ppl, and parse their strings (it'll return [] if none)
  const people = await redisAsync.lrange('mostRecent', 0, -1);
  res.json(people.map(person => JSON.parse(person)));
});

// ID route
app.use('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // see if we have that id in redis
    const redisLookup = await redisAsync.get(id);
    if (redisLookup) {
      // if we do, add it to the list & send it
      await pushRecent(redisLookup);
      res.json(JSON.parse(redisLookup));
    } else {
      //if not, get it from our dummy data, add it to recent list, and send it
      const dummyLookup = await getById(req.params.id);
      const dummyStr = JSON.stringify(dummyLookup);
      await redisAsync.set(id, dummyStr);
      await pushRecent(dummyStr);
      res.json(dummyLookup);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err || 'An internal server error has occurred.',
      code: 500
    });
  }
});

app.use('*', (req, res) => {
  res
    .status(404)
    .json({ error: 'Route Not Found', code: 404, route: req.originalUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running on port:', PORT));
