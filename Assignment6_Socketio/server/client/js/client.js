const HOST = 'http://localhost:3000';

const resultBox = data => `
   <div class="media">
      <div class="media-left">
            <img src="${data.images[0].webformatURL}" alt="${
   data.images[0].tags
}" class="image">
      </div>
      <div class="media-content">
         <div class="content">
            <p class="name">${data.user}</p>
            <p>${data.message}</p>
         </div>
      </div>
   </div>`;

const cowlog = msg => {
   console.log(`    _${Array.from(msg)
      .map(_ => '_')
      .join('')}_
   | ${msg} |
    -${Array.from(msg)
       .map(_ => '-')
       .join('')}-
           \\  ^__^
            \\ (oo)\_______
              (__)\       )\\/\\
                 ||----w |
                 ||     ||`);
};

window.onload = () => {
   // Sockets
   socket = io(HOST);
   socket.on('connect', () => {
      cowlog(`socket: ${HOST} id: ${socket.id}`);
   });
   socket.on('recieve', data => {
      let newBox = document.createElement('div');
      newBox.className = 'box';
      newBox.innerHTML = resultBox(data);
      results.appendChild(newBox);
      console.log(data);
   });
   socket.on('badreq', data => {
      alert(data);
   });
   socket.on('gooduser', () => {
      username.disabled = true;
   });

   // Form Listener
   searchForm.addEventListener('submit', ev => {
      ev.preventDefault();
      if (username.value && message.value && searchInput.value) {
         // Send the socket query
         socket.emit('search', {
            query: searchInput.value,
            username: username.value,
            message: message.value
         });
         searchInput.value = '';
         message.value = '';
      } else {
         alert('Please fill out all data fields!');
      }
   });
};
