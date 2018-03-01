import React, { Component } from 'react';
import { spotifySearch } from '../utils/spotify';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/fontawesome-free-solid';
import _ from 'lodash';
import PropTypes from 'prop-types';

class Search extends Component {
  state = {
    loading: false,
    err: null
  };

  /**
   * Method to handle the search of a specific track query, and passes the found
   * tracks to the handleResults prop. Also debounces for 500ms for live search.
   */
  handleSearch = _.debounce(async q => {
    console.log('New Request');
    const { handleResults } = this.props;
    if (q.length >= 3) {
      const { tracks } = await spotifySearch(q, this.props.tk);
      this.setState({
        loading: false,
        err: tracks.items.length > 0 ? null : 'No tracks found.'
      });
      handleResults(tracks.items);
    } else if (!q.length) {
      this.setState({
        loading: false,
        err: null
      });
      handleResults([]);
    } else {
      this.setState({
        loading: false,
        err: 'Please enter 3 or more characters.'
      });
      handleResults([]);
    }
  }, 500);

  render = () => {
    const { loading, err } = this.state;
    return (
      <div className="search">
        <FontAwesomeIcon
          icon={loading ? faSpinner : faSearch}
          className="icon"
          spin={loading}
        />
        <label htmlFor="search-input" style={{ display: 'none' }}>
          Type Search Query Here
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search"
          onChange={e => {
            this.setState({ loading: true });
            this.handleSearch(e.target.value);
          }}
        />
        {err && <div className="popup">{err}</div>}
      </div>
    );
  };
}

Search.propTypes = {
  tk: PropTypes.string.isRequired,
  handleResults: PropTypes.func.isRequired
};

export default Search;
