const uuidv4 = require('uuid/v4');
const redis = require('./redis-connection');

const defaultMessageConfig = {
  data: {},
  timeout: 1000,
  eventName: null,
  expectsResponse: true,
  redis
};

const sendMessage = (messageConfig = defaultMessageConfig) => {
  return new Promise((fulfill, reject) => {
    let settings = Object.assign({}, defaultMessageConfig, messageConfig);

    let messageId = uuidv4();
    let killswitchTimeoutId = undefined;
    let redisConnection = settings.redis;
    let eventName = settings.eventName;
    let outgoingEventName = `${eventName}:request:${messageId}`;

    if (settings.expectsResponse) {
      let successEventName = `${eventName}:success:${messageId}`;
      let failedEventName = `${eventName}:failed:${messageId}`;

      let success = redisConnection.on(
        successEventName,
        (response, channel) => {
          fulfill(response.data);
          endMessageLifeCycle();
        }
      );

      let error = redisConnection.on(failedEventName, (response, channel) => {
        reject(response.data);
        endMessageLifeCycle();
      });

      let shutoffEvents = [success, error];

      let endMessageLifeCycle = () => {
        shutoffEvents.forEach(shutOff => {
          shutOff();
        });
        clearTimeout(killswitchTimeoutId);
      };

      if (settings.timeout >= 0) {
        killswitchTimeoutId = setTimeout(() => {
          reject(new Error('timed out'));
          endMessageLifeCycle();
        }, settings.timeout);
      }
    }

    redisConnection.emit(outgoingEventName, {
      requestId: messageId,
      data: settings.data,
      eventName: settings.eventName
    });

    if (!settings.expectsResponse) {
      fulfill();
    }
  });
};

module.exports = {
  sendMessage
};
