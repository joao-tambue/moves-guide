import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import SearchBarHero from '../components/SearchBarHero';
import MediaTypeSwitcher from '../components/MediaTypeSwitcher';
import axios from 'axios'
import MovieList from '../components/MovieList';

interface Movie {
 imdbID: string;
 Title: string;
 Year: string;
 Poster: string;
 rating?: number;
}

interface Genre {
  id: number;
  name: string;
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
        let url = '';
        // Se um gênero estiver selecionado, buscar por gênero
        if (selectedGenre) {
          // Buscar o ID do gênero na API do TMDB
          const genreRes = await axios.get(`https://api.themoviedb.org/3/genre/${mediaType || 'movie'}/list?api_key=${API_KEY}&language=pt-PT`);
const genreObj = genreRes.data.genres.find((g: Genre) => g.name.toLowerCase() === selectedGenre.toLowerCase());
          const genreId = genreObj ? genreObj.id : null;
          if (genreId) {
            url = `https://api.themoviedb.org/3/discover/${mediaType || 'movie'}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&language=pt-PT`;
          } else {
            url = `https://api.themoviedb.org/3/discover/${mediaType || 'movie'}?api_key=${API_KEY}&page=${page}&language=pt-PT`;
          }
        } else if (!searchTerm.trim()) {
          url = `https://api.themoviedb.org/3/discover/${mediaType || 'movie'}?api_key=${API_KEY}&page=${page}&language=pt-PT`;
        } else {
          url = `https://api.themoviedb.org/3/search/${mediaType || 'movie'}?api_key=${API_KEY}&query=${encodeURIComponent(activeSearchTerm)}&page=${page}&language=pt-PT`;
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

  return (
    <div>
      <Navbar />
      <SearchBarHero
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onSelectGenre={setSelectedGenre}
      />
      <div className='w-[1150px] mx-auto'>
        <div className='flex justify-between items-center'>
          <h1 className='text-[25px] font-sans font-semibold text-[#00DF5E]'>Popular Films This Week</h1>
          <MediaTypeSwitcher setMediaType={setMediaType} />
        </div>
        {/* Mensagem estilizada e animada para filme não encontrado */}
        <AnimatePresence>
          {!loading && movies.length === 0 ? (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}
              className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#00DF5E]/10 rounded-2xl shadow-2xl mt-10 mb-10 border border-[#00DF5E]/30"
            >
              <svg className="w-20 h-20 mb-6 animate-bounce-slow" fill="none" stroke="#00DF5E" strokeWidth="1.5" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="#00DF5E" strokeWidth="3" fill="#0f2027" />
                <path d="M18 20c0-2 2-4 6-4s6 2 6 4" stroke="#00DF5E" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="19.5" cy="26.5" rx="1.5" ry="2.5" fill="#00DF5E"/>
                <ellipse cx="28.5" cy="26.5" rx="1.5" ry="2.5" fill="#00DF5E"/>
                <path d="M20 32c1.5 1 6.5 1 8 0" stroke="#00DF5E" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-3xl font-bold text-[#00DF5E] mb-2 drop-shadow-lg">Ops! Nenhum filme encontrado</span>
              <span className="text-lg text-gray-300 mb-8 text-center max-w-md">Não conseguimos encontrar nenhum resultado para sua busca. Tente outro nome ou clique no botão abaixo para voltar e explorar outros filmes!</span>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                  setPage(1);
                }}
                className="mt-2 px-8 py-3 bg-[#00DF5E] text-[#0f2027] rounded-full font-bold shadow-lg hover:bg-[#00b84c] transition-colors text-lg tracking-wide"
              >
                Voltar
              </motion.button>
            </motion.div>
          ) : (
            <MovieList movies={movies} loading={loading} />
          )}
        </AnimatePresence>

      </div>

      <motion.div
        className="flex justify-center items-center mt-8 gap-4 text-[#00DF5E] py-8 select-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {page > 5 && (
          <>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPage(1)}
              className="text-xl font-semibold font-sans mr-2 px-3 py-1 rounded hover:bg-[#00DF5E]/10 transition-colors"
              style={{ color: '#00DF5E' }}
            >
              first
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPage(page - 1)}
              className="text-xl font-semibold font-sans px-3 py-1 rounded hover:bg-[#00DF5E]/10 transition-colors"
              style={{ color: '#00DF5E' }}
            >
              {'<'}
            </motion.button>
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
              <motion.button
                key={num}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setPage(num)}
                className={`text-xl font-semibold font-sans px-3 py-1 rounded transition-colors ${page === num ? 'underline text-[28px] bg-[#00DF5E]/10' : ''}`}
                style={{ color: '#00DF5E' }}
              >
                {num}
              </motion.button>
            ));
        })()}
        {page < totalPages && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage(page + 1)}
            className="text-xl font-semibold font-sans px-3 py-1 rounded hover:bg-[#00DF5E]/10 transition-colors"
            style={{ color: '#00DF5E' }}
          >
            {'>'}
          </motion.button>
        )}
        {totalPages > 1 && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage(totalPages)}
            className="text-xl font-semibold ml-2 px-3 py-1 rounded hover:bg-[#00DF5E]/10 transition-colors"
            style={{ color: '#00DF5E' }}
          >
            last
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}