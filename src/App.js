import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w500';

const FILTERS = [
  { label: 'Trending', value: 'trending' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Now Playing', value: 'now_playing' },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  });
  const [similarMovies, setSimilarMovies] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [castLoading, setCastLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('trending');
  const searchTimeout = useRef();

  // Fetch popular movies on load
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '';
        if (activeFilter === 'trending') {
          url = `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
        } else if (activeFilter === 'top_rated') {
          url = `${TMDB_API_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
        } else if (activeFilter === 'upcoming') {
          url = `${TMDB_API_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
        } else if (activeFilter === 'now_playing') {
          url = `${TMDB_API_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        setError('Failed to fetch movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [activeFilter]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(!!value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(value)}&page=1&include_adult=false`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  const handleResultClick = (result) => {
    setSelectedMovie(result);
    setShowDropdown(false);
    setSearch('');
    setSearchResults([]);
  };

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleAddFavorite = (movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const handleRemoveFavorite = (movie) => {
    setFavorites(favorites.filter(fav => fav.id !== movie.id));
  };

  // Fetch more details for selected movie
  const [movieDetails, setMovieDetails] = useState(null);
  useEffect(() => {
    if (!selectedMovie) return setMovieDetails(null);
    const fetchDetails = async () => {
      setMovieDetails(null);
      try {
        const res = await fetch(`${TMDB_API_URL}/movie/${selectedMovie.id}?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await res.json();
        setMovieDetails(data);
      } catch {
        setMovieDetails(null);
      }
    };
    fetchDetails();
  }, [selectedMovie]);

  // Fetch similar movies for 'More Like This' carousel
  useEffect(() => {
    if (!selectedMovie) return setSimilarMovies([]);
    const fetchSimilar = async () => {
      setSimilarLoading(true);
      try {
        const res = await fetch(`${TMDB_API_URL}/movie/${selectedMovie.id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        setSimilarMovies(data.results || []);
      } catch {
        setSimilarMovies([]);
      } finally {
        setSimilarLoading(false);
      }
    };
    fetchSimilar();
  }, [selectedMovie]);

  // Fetch cast and reviews for selected movie
  useEffect(() => {
    if (!selectedMovie) {
      setCast([]);
      setReviews([]);
      return;
    }
    const fetchCast = async () => {
      setCastLoading(true);
      try {
        const res = await fetch(`${TMDB_API_URL}/movie/${selectedMovie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`);
        const data = await res.json();
        setCast(data.cast ? data.cast.slice(0, 10) : []);
      } catch {
        setCast([]);
      } finally {
        setCastLoading(false);
      }
    };
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`${TMDB_API_URL}/movie/${selectedMovie.id}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        setReviews(data.results ? data.results.slice(0, 3) : []);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchCast();
    fetchReviews();
  }, [selectedMovie]);

  // Suggest a random movie
  const suggestMovie = async () => {
    setLoading(true);
    setError(null);
    setSelectedMovie(null);
    try {
      const page = getRandomInt(5) + 1;
      const res = await fetch(`${TMDB_API_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
      const data = await res.json();
      if (!data.results || data.results.length === 0) throw new Error('No movies found');
      const randomMovie = data.results[getRandomInt(data.results.length)];
      setSelectedMovie(randomMovie);
    } catch (err) {
      setError('Failed to fetch movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="movie-app-root">
      <header className="movie-app-header">
        <h1 className="movie-app-logo">Movie Magic</h1>
        <p className="movie-app-subtitle">Discover trending movies, search, and save your favorites!</p>
      </header>
      <main className="movie-app-main">
        <div className="hero-section">
          <div className="hero-title">Discover Your Next Movie</div>
          <div className="hero-subtitle">
            Get instant movie suggestions or search for your favorites. Find something new every time!
          </div>
          <button className="suggest-btn" onClick={suggestMovie} disabled={loading}>
            <span className="icon" aria-hidden="true">🎬</span>
            {loading ? 'Suggesting...' : 'Suggest Me a Movie'}
          </button>
          <div className="search-bar-container">
            <input
              className="search-bar"
              type="text"
              placeholder="Search for a movie..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(!!search)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              autoComplete="off"
            />
            {showDropdown && (
              <div className={`search-dropdown fade-slide-in${searchLoading ? ' loading' : ''}`}>
                {searchLoading ? (
                  <div className="search-loading">Loading...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.slice(0, 7).map((result) => (
                    <div
                      key={result.id}
                      className="search-result"
                      onClick={() => handleResultClick(result)}
                    >
                      <img
                        src={result.poster_path ? `${TMDB_IMG_URL}${result.poster_path}` : 'https://via.placeholder.com/40x60?text=No+Image'}
                        alt={result.title}
                        className="search-result-thumb"
                      />
                      <span>{result.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">No results</div>
                )}
              </div>
            )}
          </div>
          <div className="hero-filters">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                className={`filter-btn${activeFilter === filter.value ? ' active' : ''}`}
                onClick={() => handleFilterChange(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {/* Movie Details Panel */}
        {selectedMovie && movieDetails && (
          <div className="movie-details-panel fade-in">
            <button className="close-details" onClick={() => setSelectedMovie(null)}>&times;</button>
            <img
              className="movie-details-poster"
              src={movieDetails.poster_path ? `${TMDB_IMG_URL}${movieDetails.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movieDetails.title}
            />
            <div className="movie-details-title">{movieDetails.title}</div>
            <div className="movie-details-meta">
              <span>⭐ {movieDetails.vote_average}</span>
              <span>({movieDetails.vote_count} votes)</span>
              <span>{movieDetails.release_date}</span>
              <span>{movieDetails.runtime} min</span>
              <span>{movieDetails.original_language?.toUpperCase()}</span>
            </div>
            <div className="movie-details-genres">
              {movieDetails.genres?.map(g => <span key={g.id}>{g.name}</span>)}
            </div>
            <div className="movie-details-overview">{movieDetails.overview || 'No overview available.'}</div>
            <div className="movie-details-actions">
              <a
                className="summary-btn"
                href={`https://www.themoviedb.org/movie/${movieDetails.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon" aria-hidden="true">🔗</span>
                View on TMDB
              </a>
              <button
                className={`summary-btn${favorites.some(fav => fav.id === movieDetails.id) ? ' active' : ''}`}
                onClick={() =>
                  favorites.some(fav => fav.id === movieDetails.id)
                    ? handleRemoveFavorite(movieDetails)
                    : handleAddFavorite(movieDetails)
                }
              >
                <span className="icon" aria-hidden="true">
                  {favorites.some(fav => fav.id === movieDetails.id) ? '♥' : '♡'}
                </span>
                {favorites.some(fav => fav.id === movieDetails.id)
                  ? 'Remove from Favorites'
                  : 'Add to Favorites'}
              </button>
            </div>
            <div className="section-title">Top Cast</div>
            {castLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : cast.length > 0 ? (
              <div className="cast-list">
                {cast.map(actor => (
                  <div className="cast-card" key={actor.cast_id || actor.id}>
                    <img
                      className="cast-img"
                      src={actor.profile_path ? `${TMDB_IMG_URL}${actor.profile_path}` : 'https://via.placeholder.com/80x120?text=No+Image'}
                      alt={actor.name}
                    />
                    <div className="cast-name">{actor.name}</div>
                    <div className="cast-character">as {actor.character}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-no-results">No cast info found.</div>
            )}
            <div className="section-title">Reviews</div>
            {reviewsLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div className="review-card" key={review.id}>
                    <div className="review-author">{review.author}</div>
                    <div className="review-content">{review.content.length > 300 ? review.content.slice(0, 300) + '...' : review.content}</div>
                    <a className="review-link" href={review.url} target="_blank" rel="noopener noreferrer">Read full review</a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-no-results">No reviews found.</div>
            )}
            <div className="section-title">More Like This</div>
            {similarLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : similarMovies.length > 0 ? (
              <div className="more-like-carousel">
                {similarMovies.slice(0, 10).map(similar => (
                  <div
                    className="more-like-card"
                    key={similar.id}
                    onClick={() => setSelectedMovie(similar)}
                  >
                    <img
                      className="movie-poster"
                      src={similar.poster_path ? `${TMDB_IMG_URL}${similar.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                      alt={similar.title}
                    />
                    <div className="movie-info">
                      <h2>{similar.title}</h2>
                      <div className="movie-meta">
                        <span>⭐ {similar.vote_average}</span>
                        <span>{similar.release_date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="search-no-results">No similar movies found.</div>
            )}
          </div>
        )}
        {/* Movie Grid */}
        {!selectedMovie && (
          <div className="movie-grid fade-in">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              movies.map(movie => (
                <div className="movie-card movie-grid-card" key={movie.id} onClick={() => handleCardClick(movie)}>
                  <img
                    className="movie-poster"
                    src={movie.poster_path ? `${TMDB_IMG_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={movie.title}
                  />
                  <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <div className="movie-meta">
                      <span>⭐ {movie.vote_average}</span>
                      <span>{movie.release_date}</span>
                    </div>
                    <button
                      className={`fav-btn small${favorites.some(fav => fav.id === movie.id) ? ' active' : ''}`}
                      onClick={e => { e.stopPropagation(); favorites.some(fav => fav.id === movie.id) ? handleRemoveFavorite(movie) : handleAddFavorite(movie); }}
                    >
                      {favorites.some(fav => fav.id === movie.id) ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="favorites-section fade-in">
            <h3>Your Favorites</h3>
            <div className="favorites-list">
              {favorites.map(movie => (
                <div className="movie-card fav-card" key={movie.id} onClick={() => handleCardClick(movie)}>
                  <img
                    className="movie-poster"
                    src={movie.poster_path ? `${TMDB_IMG_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={movie.title}
                  />
                  <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <div className="movie-meta">
                      <span>⭐ {movie.vote_average}</span>
                      <span>{movie.release_date}</span>
                    </div>
                    <button
                      className={`fav-btn small active`}
                      onClick={e => { e.stopPropagation(); handleRemoveFavorite(movie); }}
                    >
                      ♥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="movie-app-footer">
        <span>Powered by TheMovieDB</span>
      </footer>
      
    </div>
  );
}

export default App;
