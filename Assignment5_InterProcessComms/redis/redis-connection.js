const NRP = require('node-redis-pubsub');
const nrp = new NRP({
  port: 6379,
  scope: 'peeps' // don't really need a scope for this assignment
});
nrp.on('error', err => console.log('Redis Error:' + err));
module.exports = nrp;
