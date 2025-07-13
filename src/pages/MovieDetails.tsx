import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import { Heart, Share2 } from 'lucide-react';

const API_KEY = '9b1d4b5890a9036e5a96c1660cf6c3b9';

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { name: string }[];
  original_language: string;
  vote_count: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  key: string;
  type: string;
  site: string;
  name: string;
}

interface RecommendedMovie {
  id: number;
  title: string;
  poster_path: string;
}

// Função utilitária para partilhar
function shareMovie(movie: MovieDetails) {
  if (navigator.share) {
    navigator.share({
      title: movie.title,
      text: movie.overview,
      url: window.location.href,
    });
  } else {
    // fallback: copiar link
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado para a área de transferência!');
  }
}

// Favoritos no localStorage
function getFavorites(): number[] {
  const fav = localStorage.getItem('favoriteMovies');
  return fav ? JSON.parse(fav) : [];
}
function setFavorites(favs: number[]) {
  localStorage.setItem('favoriteMovies', JSON.stringify(favs));
}

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  // Atualiza estado de favorito ao carregar filme
  useEffect(() => {
    if (id) {
      const favs = getFavorites();
      setIsFavorite(favs.includes(Number(id)));
    }
  }, [id]);

  function handleFavorite() {
    if (!id) return;
    const favs = getFavorites();
    const movieId = Number(id);
    let updated;
    if (favs.includes(movieId)) {
      updated = favs.filter(f => f !== movieId);
      setIsFavorite(false);
    } else {
      updated = [...favs, movieId];
      setIsFavorite(true);
    }
    setFavorites(updated);
  }

  useEffect(() => {
    async function fetchAll() {
      try {
        const [detailsRes, castRes, videosRes, recommendRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-PT`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=pt-PT`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=pt-PT`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=pt-PT`)
        ]);

        setMovie(detailsRes.data);
        setCast(castRes.data.cast.slice(0, 10));

        const video = videosRes.data.results.find((v: Video) =>
          v.site === 'YouTube' && v.type === 'Trailer'
        );
        setTrailer(video || null);

        setRecommendations(recommendRes.data.results.slice(0, 10));
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id]);

  if (loading)
  return (
    <div className="text-white text-xl flex items-center justify-center min-h-screen">
      <Loading />
    </div>
  );

  if (!movie) return <div className="text-red-500 flex items-center justify-center min-h-screen">Filme não encontrado</div>;

  return (
    <div>
      
        <div
            style={{
                position: 'relative',
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                width: '100%',
                marginBottom: '2rem',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.75)',
                    zIndex: 1,
                }}
            />
            <div style={{ position: 'relative', zIndex: 2, height: '100%', }}>
              <div className='flex flex-col'>
                <button className='justify-start flex px-4 sm:px-8 lg:px-32 pt-8 pb-0 z-30'>
                  <button className="text-white bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-2">
                    <Link to={'/home'}>
                      Voltar
                    </Link>
                    
                  </button>
                </button>
                <div className="flex flex-col lg:flex-row gap-8 text-white px-4 sm:px-6 lg:px-10 py-8 max-w-6xl mx-auto z-30">
                    <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full sm:w-full sm:h-[500px] object-cover bg-no-repeat rounded-lg shadow-md mx-auto lg:mx-0"
                    />
                    <div>
                      <div>
                          <h1 className="text-4xl mb-4 font-sans font-semibold">{movie.title}</h1>
                          <p><strong>Gênero:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
                          <p><strong>Data de Lançamento:</strong> {movie.release_date}</p>
                          <p><strong>Nota TMDb:</strong> {movie.vote_average}</p>
                          <p className="mt-4"><strong>Sinopse:</strong> {movie.overview}</p>
                      </div>
                      <div>
                          <h2 className="text-2xl mt-6 mb-4 font-sans font-semibold">Informações</h2>
                          <p><strong>Idioma Original:</strong> {movie.original_language.toUpperCase()}</p>
                          <p><strong>Popularidade:</strong> {movie.vote_average}</p>
                          <p><strong>Votos:</strong> {movie.vote_count}</p>
                      </div>
                      <div className='mt-6 flex flex-wrap items-center gap-4'>
                        <Link to={`/watch/${id}`} className='bg-[#00DF5E] text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors'>
                          Assistir Agora
                        </Link>
                        <button
                          className={`bg-gray-500 hover:bg-red-500 rounded-full p-6 flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-600' : 'bg-gray-500'}`}
                          onClick={handleFavorite}
                          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                          <Heart className={`text-white ${isFavorite ? 'fill-red-500' : ''}`} fill={isFavorite ? '#ef4444' : 'none'} />
                        </button>
                        <button
                          className='bg-gray-500 rounded-full p-6 flex items-center justify-center hover:bg-blue-600 transition-colors'
                          onClick={() => movie && shareMovie(movie)}
                          title='Partilhar'
                        >
                          <Share2 className='text-white' />
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
        <div className="text-white p-4 sm:p-4 flex flex-col gap-10 max-w-6xl mx-auto">
        <div >
            
        </div>

        {/* Elenco */}
        <div>
            <h2 className="text-[25px] font-sans font-semibold text-[#00DF5E] mb-4">Elenco Principal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cast.map(actor => (
                <Link to={`/actor/${actor.id}`} key={actor.id} className="relative mt-6 w-full  md:w-[220px] mx-auto rounded-2xl cursor-pointer shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] hover:scale-105 transition-transform duration-300 group">
                <img
                    src={
                    actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=Sem+foto'
                    }
                    alt={actor.name}
                    className="w-full h-72 object-cover rounded-2xl border-2 border-[#23272f] group-hover:border-[#00DF5E] transition-all duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0"
                />
                <div className="p-4 text-white text-center">
                  <p className="text-sm font-bol text-center">{actor.name}</p>
                  <p className="text-x text-center">como: {actor.character}</p>
                </div>
                </Link>
            ))}
            </div>
        </div>

        {/* Trailer */}
        {trailer && (
            <div>
            <h2 className="text-[25px] font-sans font-semibold text-[#00DF5E] mb-4">Trailer Oficial</h2>
            <div className="aspect-video w-full max-w-[90vw] mx-auto">
                <iframe
                className="rounded-lg w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allowFullScreen
                ></iframe>
            </div>
            </div>
        )}

        {/* Recomendados */}
        <div>
            <h2 className="text-[25px] font-sans font-semibold text-[#00DF5E] mb-4">Filmes Recomendados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map(rec => (
                <div key={rec.id} className=" relative mt-6 w-full  md:w-[220px] mx-auto rounded-2xl cursor-pointer shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] hover:scale-105 transition-transform duration-300 group">
                    <Link to={`/details/${rec.id}`}>
                    <img
                        src={
                        rec.poster_path
                            ? `https://image.tmdb.org/t/p/w300${rec.poster_path}`
                            : 'https://via.placeholder.com/300x450?text=Sem+imagem'
                        }
                        alt={rec.title}
                        className="w-full h-72 object-cover rounded-2xl border-2 border-[#23272f] group-hover:border-[#00DF5E] transition-all duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0"
                    />
                    <div className="p-2 text-sm font-medium text-center text-[#FFFF]">{rec.title}</div>
                    </Link>
                </div>
                ))}
            </div>
        </div>
        </div>
    </div>
  );
}
