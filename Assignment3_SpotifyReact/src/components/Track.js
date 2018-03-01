import React from 'react';
import _ from 'lodash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {
  faCircle as closed,
  faPlay,
  faPause,
  faTimes
} from '@fortawesome/fontawesome-free-solid';
import { faCircle as open } from '@fortawesome/fontawesome-free-regular';

const fixTime = ms => {
  const min = Math.floor(ms / 60000);
  const sec = ((ms % 60000) / 1000).toFixed(0);
  return min + ':' + (sec < 10 ? '0' : '') + sec;
};

const pop = ularity =>
  _.range(5).map((e, i) => (
    <FontAwesomeIcon
      key={i}
      icon={ularity >= i * 20 ? closed : open}
      className="track-artist"
    />
  ));

export default ({ track, onClick, playing }) => (
  <div className="track">
    <img
      src={track.album.images[0].url}
      alt={`${track.album.name} Cover Art`}
      onClick={onClick}
    />
    <a className="overlay" onClick={onClick}>
      <FontAwesomeIcon
        size="2x"
        icon={track.preview_url ? (playing ? faPause : faPlay) : faTimes}
      />
    </a>
    <div className="split">
      <div className="track-container">
        <a
          href=""
          className="track-title"
          style={{ color: playing ? 'var(--siimple-blue-0)' : 'inherit' }}
        >
          {track.name}
        </a>
        <div>
          <a href={track.album.external_urls.spotify} className="track-artist">
            {track.album.name}
          </a>
          {' - '}
          <a
            href={track.artists[0].external_urls.spotify}
            className="track-artist"
          >
            {track.artists[0].name}
          </a>
        </div>
      </div>
      <div className="track-container" style={{ alignItems: 'flex-end' }}>
        <span>{fixTime(track.duration_ms)}</span>
        <span>{pop(track.popularity)}</span>
      </div>
    </div>
  </div>
);
