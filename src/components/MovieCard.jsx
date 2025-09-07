import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../context/AppState';
import Poster from './Poster';

export default function MovieCard({ movie }) {
  const { user } = useAppState();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const loc = useLocation();

  const canAdd = !!user;

  const addToWatch = () => {
    if (!canAdd) {
      nav(`/login?next=${encodeURIComponent(loc.pathname)}`);
      return;
    }
    dispatch({ type: 'WATCH_ADD', item: movie });
  };

  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 shadow">
      <Link to={`/movie/${movie.id}`} className="block">
        <Poster
          src={movie.poster}
          alt={movie.title}
          w={100}
          h={150}
          className="h-36 w-24 rounded object-cover transition hover:opacity-90"
        />
      </Link>

      <div className="flex w-full flex-col justify-between">
        <div>
          <Link to={`/movie/${movie.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold">{movie.title}</h3>
          </Link>
          <p className="text-sm text-gray-600">{movie.year}</p>
        </div>

        <div className="mt-3">
          <button
            onClick={addToWatch}
            disabled={!canAdd}
            title={canAdd ? 'Add to watchlist' : 'Sign in to add'}
            className={[
              'rounded-xl px-3 py-2 text-white',
              canAdd ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'
            ].join(' ')}
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    year: PropTypes.string,
    poster: PropTypes.string,
  }).isRequired,
};
