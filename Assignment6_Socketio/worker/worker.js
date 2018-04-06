const axios = require('axios');
const _ = require('lodash');
const redis = require('../redis/redis-connection');

const API_KEY = '8596479-cc9a2c5cac4aba1d08589aaa7'; // no steal pls

const pixaBay = axios.create({
   baseURL: 'https://pixabay.com/api/',
   timeout: 5000
});

// Simple helper function to emit to redis
const emit = (msg, data, err = false) => {
   const { eventName, requestId } = msg;
   redis.emit(`${eventName}:${err ? 'failed' : 'success'}:${requestId}`, {
      data,
      requestId,
      eventName
   });
};

redis.on('imgsearch:request:*', async msg => {
   try {
      const { data } = await pixaBay({
         params: {
            key: API_KEY,
            q: msg.data.query,
            safesearch: true,
            per_page: 5
         }
      });
      emit(msg, data);
   } catch (oops) {
      const err = oops.toString() || 'Server Error: Request failed.';
      emit(msg, err, true);
   }
});

console.log('Worker is waiting...');
