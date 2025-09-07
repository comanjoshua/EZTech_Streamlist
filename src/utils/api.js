// src/utils/api.js

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w780';

// Env: v4 bearer or v3 key
const V4_TOKEN = process.env.REACT_APP_TMDB_TOKEN; // v4 read token (eyJ...)
const V3_KEY   = process.env.REACT_APP_TMDB_KEY;   // v3 API key (32-char hex)
const HAS_V4   = !!V4_TOKEN;
const HAS_V3   = !!V3_KEY;
export const HAS_AUTH = HAS_V4 || HAS_V3;

// ------- helpers -------

const posterUrl   = p => (p ? `${TMDB_IMG}${p}` : null);
const backdropUrl = p => (p ? `${TMDB_BACKDROP}${p}` : null);

function toMovieLite(m) {
  if (!m) return null;
  const id = m.id != null ? String(m.id) : null;
  if (!id) return null;
  return {
    id,
    title: m.title || m.name || '',
    year: m.release_date ? m.release_date.slice(0, 4) : '',
    poster: posterUrl(m.poster_path),
  };
}

async function tmdbFetch(endpoint, { query = {}, signal } = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  for (const [k, v] of Object.entries(query)) {
    if (v != null && v !== '') url.searchParams.set(k, String(v));
  }

  const headers = { Accept: 'application/json' };
  if (HAS_V4) headers.Authorization = `Bearer ${V4_TOKEN}`;
  if (!HAS_V4 && HAS_V3) url.searchParams.set('api_key', V3_KEY);

  const res = await fetch(url.toString(), { headers, signal });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`TMDB ${endpoint} failed: ${res.status} ${body}`);
  }
  return res.json();
}

// ------- public API (named exports) -------

export async function searchMovies(queryText, signal) {
  const q = (queryText || '').trim();
  if (!q) return [];

  // No creds → demo list
  if (!HAS_AUTH) {
    const low = q.toLowerCase();
    return MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(low));
  }

  try {
    const data = await tmdbFetch('/search/movie', {
      query: { query: q, include_adult: 'false', language: 'en-US', page: 1 },
      signal,
    });

    const list = Array.isArray(data.results) ? data.results : [];
    const mapped = list.map(toMovieLite).filter(Boolean);

    const seen = new Set();
    const unique = [];
    for (const m of mapped) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        unique.push(m);
      }
    }
    return unique;
  } catch (e) {
    // Fall back to demo data so the UI still shows something
    const low = q.toLowerCase();
    return MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(low));
  }
}

export async function getMovieDetails(id, signal) {
  const movieId = String(id || '').trim();
  if (!movieId) throw new Error('missing id');

  if (!HAS_AUTH) {
    const m = MOCK_MOVIES.find(x => x.id === movieId);
    if (!m) throw new Error('mock movie not found');
    return {
      id: m.id,
      title: m.title,
      year: m.year,
      overview: 'Overview not available in mock data.',
      runtime: 0,
      genres: [],
      rating: null,
      poster: m.poster,
      backdrop: null,
    };
  }

  try {
    const m = await tmdbFetch(`/movie/${movieId}`, {
      query: { language: 'en-US' },
      signal,
    });

    return {
      id: String(m.id),
      title: m.title || m.name || '',
      year: m.release_date ? m.release_date.slice(0, 4) : '',
      overview: m.overview || '',
      runtime: m.runtime || 0,
      genres: Array.isArray(m.genres) ? m.genres.map(g => g.name) : [],
      rating: typeof m.vote_average === 'number' ? m.vote_average : null,
      poster: posterUrl(m.poster_path),
      backdrop: backdropUrl(m.backdrop_path),
    };
  } catch (e) {
    const m = MOCK_MOVIES.find(x => x.id === movieId);
    if (m) {
      return {
        id: m.id,
        title: m.title,
        year: m.year,
        overview: 'Overview not available in mock data.',
        runtime: 0,
        genres: [],
        rating: null,
        poster: m.poster,
        backdrop: null,
      };
    }
    throw e;
  }
}

// ------- mock (used with no creds or on error) -------

const MOCK_MOVIES = [
  { id: '27205', title: 'Inception',    year: '2010',
    poster: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg' },
  { id: '603',   title: 'The Matrix',   year: '1999',
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
  { id: '157336',title: 'Interstellar', year: '2014',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
];
