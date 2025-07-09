import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import eye from '../assets/icon/eye.svg'
import iconcoracao from '../assets/icon/iconcoracao.svg'

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  rating?: number;
  vote_average?: number;
}

const saveToLocalStorage = (key: string, movie: Movie & { rating: number }) => {
    const existing: (Movie & { rating: number })[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.filter((m) => m.imdbID !== movie.imdbID);
    updated.push(movie);
    localStorage.setItem(key, JSON.stringify(updated));
  }

export default function MovieCard({ movie }: { movie: Movie }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [rating, setRating] = useState(0);
    const [imgLoaded, setImgLoaded] = useState(false);
    const navigate = useNavigate();

    const handleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();
      saveToLocalStorage('favorites', { ...movie, rating });
    }

    const handleWatched = (e: React.MouseEvent) => {
      e.stopPropagation();
      saveToLocalStorage('watched', { ...movie, rating });
    }

    const handleRating = (value: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setRating(value);
      saveToLocalStorage('favorites', { ...movie, rating: value });
      saveToLocalStorage('watched', { ...movie, rating: value });
    }

    return (
      <div
        className="relative mt-6 w-[220px] mx-auto rounded-2xl cursor-pointer shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] hover:scale-105 transition-transform duration-300 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
        onClick={() => navigate(`/movie/${movie.imdbID}`)}
      >
        <div className="relative w-full h-72 rounded-2xl overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#23272f] animate-pulse z-10">
              <svg className="w-10 h-10 text-[#00DF5E] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          )}
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/176x260'}
            alt={movie.Title}
            className={`w-full h-72 object-cover rounded-2xl border-2 border-[#23272f] group-hover:border-[#00DF5E] transition-all duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
          {hovered && (
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full px-3 py-1 shadow-lg hover:bg-[#00DF5E] hover:text-black transition-colors duration-200"
              onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            >
              <span className="text-white text-2xl font-bold">⋮</span>
            </button>
          )}
          {menuOpen && (
            <div className="absolute top-12 right-2 bg-[#181818] text-[13px] text-white rounded-xl shadow-2xl z-20 p-4 flex flex-col gap-3 min-w-[120px] border border-[#23272f] animate-fade-in">
              <button className="text-left px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-[#00DF5E] hover:text-black transition-colors" onClick={handleFavorite}>
                <img src={iconcoracao} alt="icon" className="w-5 h-5" />
                Favorito
              </button>
              <button className="text-left px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-[#00DF5E] hover:text-black transition-colors" onClick={handleWatched}>
                <img src={eye} alt="icon" className="w-5 h-5" />
                Watched
              </button>
              <div className="flex items-center gap-1 justify-center mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`cursor-pointer text-[20px] ${star <= rating ? 'text-yellow-400 drop-shadow' : 'text-gray-500'} hover:scale-125 transition-transform`}
                    onClick={e => handleRating(star, e)}
                    role="button"
                    aria-label={`Marcar ${star} estrela${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="py-4 px-2 text-white text-center">
          <h1 className="font-bold text-[18px] truncate mb-1 drop-shadow-lg">{movie.Title}</h1>
          <p className="text-sm text-gray-400 mt-1 drop-shadow">
            {new Date().toLocaleDateString('pt-PT', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          {movie.vote_average !== undefined && (
            <p className="text-sm text-[#00DF5E] font-semibold mt-1 drop-shadow">
              <strong>Nota TMDb:</strong> {movie.vote_average}
            </p>
          )}
        </div>
      </div>
    )
  }