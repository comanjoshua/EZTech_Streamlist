import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function Poster({ src, alt, w = 100, h = 150, className = '' }) {
  const [errored, setErrored] = useState(false);
  const url = !errored && src ? src : `https://placehold.co/${w}x${h}?text=No+Poster`;

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

Poster.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  w: PropTypes.number,
  h: PropTypes.number,
  className: PropTypes.string,
};
