const axios = require('axios');
const redis = require('../redis/redis-connection');
const gist =
  'https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json';

// Need to fetch data as soon as file is ran, so IIFE
(async () => {
  const gistData = (await axios.get(gist)).data;
  console.log(gistData[0]);

  redisConnection.on('get:request:*', (msg, chnl) => {});
  redisConnection.on('post:request:*', (msg, chnl) => {});
  redisConnection.on('delete:request:*', (msg, chnl) => {});
  redisConnection.on('put:request:*', (msg, chnl) => {});
})();
