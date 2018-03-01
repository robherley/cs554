import React, { Component, Fragment } from 'react';
import Search from './Search';
import Logo from './Logo';
import Track from './Track';
import { spotifyAuth } from '../utils/spotify';

class App extends Component {
  state = {
    results: [],
    currentTrack: null
  };

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

  /**
   * Get the results, adds to state
   * @param results list of results from spotify api
   */
  updateResults = results => {
    this.setState({ results, currentTrack: null }, () =>
      this.refs.audio_tag.pause()
    );
  };

  /**
   * Plays a current track using html5 audio
   * @param currentTrack spotify url of preview url
   */
  playSong = currentTrack => {
    if (currentTrack === this.state.currentTrack) {
      this.setState({ currentTrack: null }, () => this.refs.audio_tag.pause());
    } else {
      this.setState({ currentTrack }, () => this.refs.audio_tag.play());
    }
  };

  render = () => {
    const { access_token, results, currentTrack } = this.state;
    return (
      <Fragment>
        <div className="search-container">
          <Logo
            head={access_token ? 'howdy,' : 'Loading...'}
            sub={access_token ? 'please search for a track' : ''}
          />
          {access_token && (
            <Search tk={access_token} handleResults={this.updateResults} />
          )}
        </div>
        <div className="list-container">
          {results.map((e, i) => (
            <Track
              onClick={() => e.preview_url && this.playSong(e.preview_url)}
              key={i}
              playing={
                e.preview_url && e.preview_url === this.state.currentTrack
              }
              track={e}
            />
          ))}
        </div>
        <audio
          ref="audio_tag"
          src={currentTrack}
          onEnded={() => this.setState({ currentTrack: null })}
        />
      </Fragment>
    );
  };
}

export default App;
