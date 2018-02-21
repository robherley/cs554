import React, { Component, Fragment } from 'react';
import { spotifySearch } from '../utils/spotify';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/fontawesome-free-solid';
import _ from 'lodash';
import PropTypes from 'prop-types';

class Search extends Component {
  state = {
    results: [],
    loading: false,
    err: null
  };

  handleSearch = _.debounce(async q => {
    if (q.length >= 4) {
      const { tracks } = await spotifySearch(q, this.props.tk);
      this.setState({
        results: tracks.items,
        loading: false,
        err: tracks.items.length > 0 ? null : 'No tracks found.'
      });
    } else if (!q.length) {
      this.setState({
        results: [],
        loading: false,
        err: null
      });
    } else {
      this.setState({
        results: [],
        loading: false,
        err: 'Please enter 4 or more characters.'
      });
    }
  }, 300);

  render = () => {
    const { results, loading, err } = this.state;
    return (
      <Fragment>
        <div className="search">
          <FontAwesomeIcon
            icon={loading ? faSpinner : faSearch}
            className="icon"
            spin={loading}
          />
          <input
            type="text"
            onChange={e => {
              this.setState({ loading: true });
              this.handleSearch(e.target.value);
            }}
          />
          {err && <div className="popup">{err}</div>}
        </div>
        <ul>
          {results.map((e, i) => (
            <li key={i}>
              {e.name} - {e.artists[0].name}
            </li>
          ))}
        </ul>
      </Fragment>
    );
  };
}

Search.propTypes = {
  tk: PropTypes.string.isRequired
};

export default Search;
