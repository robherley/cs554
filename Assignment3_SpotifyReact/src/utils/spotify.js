import axios from 'axios';

const CLIENT_ID = '37d34590e3d44d90a0cf9140fe3474ed',
  CLIENT_SECRET = 'a303c399f1994ee18da01a499e5826c5';

const base64 = new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const config = {
  headers: {
    Authorization: `Basic ${base64}`
  }
};

const spotifyAuth = async () => {
  const { data } = await axios.post(
    'https://cs-554-spotify-proxy.herokuapp.com/api/token',
    'grant_type=client_credentials',
    config
  );
  return data;
};

const spotifySearch = async (q, token) => {
  const { data } = await axios.get(
    'https://cs-554-spotify-proxy.herokuapp.com/v1/search',
    {
      params: {
        q,
        type: 'track',
        market: 'US'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return data;
};

export { spotifyAuth, spotifySearch };
