const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { sendMessage } = require('../redis/nrp-sender-shim');
const app = express();

// Just serve static files
app.use(express.static(path.join(__dirname + '/client/')));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
   console.log('Server is running on port:', PORT)
);

const io = require('socket.io')(server);

const getCurrentUsers = () => {
   const { connected } = io.sockets;
   return Object.keys(connected).map(skt => connected[skt].username);
};

app.get('/users', (req, res) => {
   res.json(getCurrentUsers());
});

io.sockets.on('connection', socket => {
   console.log(`Client (id: ${socket.id}) connected.`);

   socket.on('search', async data => {
      console.log('Received:', data.query, 'from', socket.id);
      try {
         if (!socket.username) {
            if (getCurrentUsers().indexOf(data.username) !== -1) {
               // No dupe users
               throw `The username '${data.username}' is already taken!`;
            }
            // Add the username to the current socket.
            socket.username = data.username;
            socket.emit('gooduser');
            console.log(`Assigned ${data.username} -> ${socket.id}`);
         }

         const imgResults = await sendMessage({
            eventName: 'imgsearch',
            data
         });

         if (imgResults.totalHits === 0)
            throw `No images found for '${data.query}'`;

         const broadcast = {
            user: socket.username,
            images: imgResults.hits,
            message: data.message
         };

         socket.broadcast.emit('recieve', broadcast);
         socket.emit('recieve', broadcast);
      } catch (e) {
         socket.emit('badreq', e);
         console.error('Sending error!', e);
      }
   });

   socket.on('disconnect', () => {
      console.log(`Client (id: ${socket.id}) disconnected.`);
   });
});
