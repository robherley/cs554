import React, { Component, Fragment } from 'react';
import Search from './Search';
import { spotifyAuth } from '../utils/spotify';

class App extends Component {
  state = {};

  /**
   * Generates a new access token from spotify.
   * @param {Function} cb Optional callback to call after the state is changed.
   */
  setAuth = async cb => {
    const { access_token, expires_in } = await spotifyAuth();
    console.log('New Auth Token Generated:', access_token);
    this.setState({ access_token, expires_in }, cb);
  };

  /**
   * Generates new token on mount, and sets an interval to update the token by
   * the expire time in the request.
   */
  componentDidMount = async () => {
    await this.setAuth(() => {
      setInterval(
        async () => await this.setAuth(null),
        this.state.expires_in * 1000
      );
    });
  };

  render = () => {
    const { access_token } = this.state;
    return (
      <Fragment>
        <h1>
          Howdy, <span>please search for a song.</span>
        </h1>
        {access_token && <Search tk={access_token} />}
      </Fragment>
    );
  };
}

export default App;
