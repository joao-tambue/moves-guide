import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import eye from '../assets/icon/eye.svg'
import iconcoracao from '../assets/icon/iconcoracao.svg'
import bgImage from '../assets/image/Rectangle 9.png'
import axios from 'axios'
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
import Loading from '../components/Loading';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  rating?: number;
}

const genres = [
  'Ação', 'Aventura', 'Animação', 'Comédia', 'Crime', 'Documentário',
  'Drama', 'Família', 'Fantasia', 'História', 'Terror', 'Música',
  'Mistério', 'Romance', 'Ficção científica', 'Cinema TV', 'Thriller', 'Guerra', 'Faroeste'
];

const Filter = ({ onSelectGenre }: { onSelectGenre: (genre: string) => void }) => {
  return (
    <div className='flex flex-col items-center gap-3 justify-center py-3 font-sans font-semibold'>
      <div className='flex items-center gap-3 justify-center font-sans flex-wrap'>
        {genres.map(genre => (
          <button
            key={genre}
            className='px-3 py-2 bg-white rounded hover:bg-[#00DF5E]'
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [mediaType, setMediaType] = useState<'movie' | 'series' | ''>(''); 
  const defaultSearchTerms = ['fast', 'marvel', 'new'];
  const activeSearchTerm = searchTerm.trim() !== '' ? searchTerm : defaultSearchTerms[Math.floor(Math.random() * defaultSearchTerms.length)];
  const API_KEY = '9b1d4b5890a9036e5a96c1660cf6c3b9';

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        let url = `https://api.themoviedb.org/3/search/${mediaType || 'movie'}?api_key=${API_KEY}&query=${encodeURIComponent(activeSearchTerm)}&page=${page}&language=pt-PT`;
        if (!searchTerm.trim()) {
          url = `https://api.themoviedb.org/3/discover/${mediaType || 'movie'}?api_key=${API_KEY}&page=${page}&language=pt-PT`;
        }
        const res = await axios.get(url);
        if (res.data && res.data.results) {
          setMovies(
            res.data.results.map((item: {
              id: string;
              title?: string;
              name?: string;
              release_date?: string;
              first_air_date?: string;
              poster_path?: string;
            }) => ({
              imdbID: item.id,
              Title: item.title || item.name || '',
              Year: (item.release_date || item.first_air_date || '').slice(0, 4),
              Poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/176x260',
            }))
          );
          setTotalPages(res.data.total_pages);
        } else {
          setMovies([]);
        }
      } catch {
        setMovies([]);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [page, selectedGenre, mediaType, activeSearchTerm, searchTerm]);

  const saveToLocalStorage = (key: string, movie: Movie & { rating: number }) => {
    const existing: (Movie & { rating: number })[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.filter((m) => m.imdbID !== movie.imdbID);
    updated.push(movie);
    localStorage.setItem(key, JSON.stringify(updated));
  }

  function MovieCard({ movie }: { movie: Movie }) {
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

  return (
    <div className=''>
      <Navbar />
      <div style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className='py-28 pb-7 flex flex-col items-center px-[200px]'>
          <div className="relative w-[500px]">
          <input
            type="search"
            placeholder="Search a title"
            className="w-full text-sm pl-4 pr-10 py-3 rounded-full border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm placeholder:text-gray-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 pointer-events-none"
            size={18}
          />
        </div>
          <h1 className='text-[46px] text-white font-sans font-semibold text-center'>
            Track films you've watched. <br /> Discover millions of movies. <br />
            Explore now.
          </h1>
          <p className='text-center text-white'>FILTER BY:</p>
          <Filter onSelectGenre={setSelectedGenre} />
        </div>
      </div>

      <div className='w-[1150px] mx-auto mt-10'>
        <div className='flex justify-between items-center'>
          <h1 className='text-[25px] font-sans font-semibold text-[#00DF5E]'>Popular Films This Week</h1>
          <div className="flex gap-4 my-4 justify-center">
            <button onClick={() => setMediaType('movie')} className="bg-white px-4 py-2 rounded hover:bg-[#00DF5E]">Filmes</button>
            <button onClick={() => setMediaType('series')} className="bg-white px-4 py-2 rounded hover:bg-[#00DF5E]">Séries</button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-white text-xl"><Loading/></span>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2 justify-between">
            {movies.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
        <div className="flex justify-center items-center mt-8 gap-8 text-[#00DF5E] py-14 select-none">
          {/* Página dinâmica: mostra 5 números, com setas para navegar para frente e para trás */}
          {page > 5 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="text-xl font-semibold font-sans mr-2"
                style={{ color: '#00DF5E' }}
              >
                first
              </button>
              <button
                onClick={() => setPage(page - 1)}
                className="text-xl font-semibold font-sans"
                style={{ color: '#00DF5E' }}
              >
                {'<'}
              </button>
            </>
          )}
          {(() => {
            let start = 1;
            if (page > 3 && totalPages > 5) {
              if (page + 2 > totalPages) {
                start = Math.max(totalPages - 4, 1);
              } else {
                start = page - 2;
              }
            }
            return Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i)
              .map(num => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`text-xl font-semibold font-sans transition-colors ${page === num ? 'underline text-[28px]' : ''}`}
                  style={{ color: '#00DF5E' }}
                >
                  {num}
                </button>
              ));
          })()}
          {page < totalPages && (
            <button
              onClick={() => setPage(page + 1)}
              className="text-xl font-semibold font-sans"
              style={{ color: '#00DF5E' }}
            >
              {'>'}
            </button>
          )}
          {totalPages > 1 && (
            <button
              onClick={() => setPage(totalPages)}
              className="text-xl font-semibold ml-2"
              style={{ color: '#00DF5E' }}
            >
              last
            </button>
          )}
        </div>
      </div>
    </div>
  )
}