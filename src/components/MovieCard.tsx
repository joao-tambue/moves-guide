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
        className="relative mt-4 w-[220px] mx-auto rounded-lg cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
        onClick={() => navigate(`/movie/${movie.imdbID}`)}
      >
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/176x260'}
          alt={movie.Title}
          className="w-full h-72 object-cover hover:border-2 hover:rounded border-white border-2 rounded hover:border-[#00DF5E] transition-all"
        />
        {hovered && (
          <button
            className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full px-2"
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          >
            <span className="text-white text-2xl -mt-2">...</span>
          </button>
        )}
        {menuOpen && (
          <div className="absolute top-10 right-2 bg-[#000000] text-[12px] text-white rounded shadow-lg z-10 p-3 flex flex-col gap-2">
            <button className="text-left px-2 py-1 flex items-center gap-2" onClick={handleFavorite}>
              <img src={iconcoracao} alt="icon" />
              Favorito
            </button>
            <button className="text-left px-2 py-1 flex items-center gap-2" onClick={handleWatched}>
              <img src={eye} alt="icon" />
              Watched
            </button>
            <div className="flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`cursor-pointer text-[16px] ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
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
        <div className="py-4 text-white">
          <h1 className="font-semibold text-[16px] truncate">{movie.Title}</h1>
          <p className="text-[14px]">{movie.Year}</p>
        </div>
      </div>
    )
  }