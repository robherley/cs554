const axios = require('axios');
const _ = require('lodash');
const redis = require('../redis/redis-connection');
const Joi = require('joi');
const gist =
  'https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json';

// Simple helper function to emit to redis
const emit = (msg, data, err = false) => {
  const { eventName, requestId } = msg;
  redis.emit(`${eventName}:${err ? 'failed' : 'success'}:${requestId}`, {
    data,
    requestId,
    eventName
  });
};

// Joi schema to compare the data, this helps with object validation
const userSchema = {
  id: Joi.number()
    .integer()
    .min(1),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  gender: Joi.string(),
  ip_address: Joi.string().ip()
};

// Need to fetch data as soon as file is ran, so IIFE
(async () => {
  let gistData = (await axios.get(gist)).data;

  redis.on('get:request:*', msg => {
    try {
      const { requestId, eventName, data } = msg;
      const person = _.find(gistData, ['id', parseInt(data.id)]);
      if (!person) {
        emit(
          msg,
          {
            info: `Person not found for the specified id: ${data.id}`,
            code: 404
          },
          true
        );
      } else {
        emit(msg, person);
      }
    } catch (e) {
      console.log(e);
      emit(msg, { info: 'An error has occured in the worker.' }, true);
    }
  });

  redis.on('post:request:*', msg => {
    try {
      const { requestId, eventName, data } = msg;
      const person = _.find(gistData, ['id', parseInt(data.body.id)]);
      if (person) {
        emit(
          msg,
          {
            info: `A person already exists for this id: ${data.body.id}`,
            code: 500
          },
          true
        );
      } else {
        const { error, value } = Joi.validate(data.body, userSchema);
        if (error) {
          emit(
            msg,
            {
              info: error.details.map(e => e.message),
              code: 500
            },
            true
          );
        } else {
          gistData[value.id] = value;
          emit(msg, value);
        }
      }
    } catch (e) {
      console.log(e);
      emit(msg, { info: 'An error has occured in the worker.' }, true);
    }
  });

  redis.on('delete:request:*', msg => {
    try {
      const { requestId, eventName, data } = msg;
      const removed = _.remove(
        gistData,
        p => (p ? p.id === parseInt(data.id) : false)
      );
      if (removed.length === 0) {
        emit(
          msg,
          {
            info: `Person not found for the specified id: ${data.id}`,
            code: 404
          },
          true
        );
      } else {
        emit(msg, {
          deleted: true,
          deletedContent: removed[0]
        });
      }
    } catch (e) {
      console.log(e);
      emit(msg, { info: 'An error has occured in the worker.' }, true);
    }
  });

  redis.on('put:request:*', msg => {
    try {
      const { requestId, eventName, data } = msg;
      const person = _.find(gistData, ['id', parseInt(data.id)]);
      if (data.body.id && data.body.id !== data.id) {
        emit(
          msg,
          {
            info:
              'ID of a person is immutable. Request body and param ID are different.'
          },
          true
        );
      } else {
        if (!person) {
          emit(
            msg,
            {
              info: `Person not found for the specified id: ${data.id}`,
              code: 404
            },
            true
          );
        } else {
          const merged = _.merge({}, person, data.body);
          const { error, value } = Joi.validate(merged, userSchema);
          if (error) {
            emit(
              msg,
              {
                info: error.details.map(e => e.message)
              },
              true
            );
          } else {
            gistData[value.id] = value;
            emit(msg, value);
          }
        }
      }
    } catch (e) {
      console.log(e);
      emit(msg, { info: 'An error has occured in the worker.' }, true);
    }
  });
})().catch(err => {
  console.error('An error occurred in the worker!');
  console.error(err);
  process.exit(1);
});
