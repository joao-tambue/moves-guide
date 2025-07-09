import { useState, useEffect } from 'react'
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
          const genreObj = genreRes.data.genres.find((g: any) => g.name.toLowerCase() === selectedGenre.toLowerCase());
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
      <div className='w-[1150px] mx-auto mt-10'>
        <div className='flex justify-between items-center'>
          <h1 className='text-[25px] font-sans font-semibold text-[#00DF5E]'>Popular Films This Week</h1>
          <MediaTypeSwitcher setMediaType={setMediaType} />
        </div>
        <MovieList movies={movies} loading={loading} />
      </div>

      <div className="flex justify-center items-center mt-8 gap-8 text-[#00DF5E] py-14 select-none">
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
  );
}