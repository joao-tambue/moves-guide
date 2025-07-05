import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_KEY = '9b1d4b5890a9036e5a96c1660cf6c3b9';

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { name: string }[];
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

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-white text-xl p-10">Carregando...</div>;
  if (!movie) return <div className="text-red-500 p-10">Filme não encontrado</div>;

  return (
    <div className="text-white p-10 flex flex-col gap-10 max-w-6xl mx-auto">
      {/* Detalhes */}
      <div className="flex gap-10">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-[300px] rounded-lg shadow-md"
        />
        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p><strong>Gênero:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Data de Lançamento:</strong> {movie.release_date}</p>
          <p><strong>Nota TMDb:</strong> {movie.vote_average}</p>
          <p className="mt-4"><strong>Sinopse:</strong> {movie.overview}</p>
        </div>
      </div>

      {/* Elenco */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Elenco Principal</h2>
        <div className="grid grid-cols-5 gap-4">
          {cast.map(actor => (
            <div key={actor.id} className="bg-[#111] rounded-lg p-2 text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=Sem+foto'
                }
                alt={actor.name}
                className="w-full h-[278px] object-cover rounded mb-2"
              />
              <p className="text-sm font-bold">{actor.name}</p>
              <p className="text-xs text-gray-300">como {actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Trailer Oficial</h2>
          <div className="aspect-video w-full max-w-3xl mx-auto">
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
        <h2 className="text-2xl font-semibold mb-4">Filmes Recomendados</h2>
        <div className="grid grid-cols-5 gap-4">
          {recommendations.map(rec => (
            <div key={rec.id} className="bg-[#111] rounded-lg overflow-hidden">
                <Link to={`/details/${rec.id}`}>
                <img
                    src={
                    rec.poster_path
                        ? `https://image.tmdb.org/t/p/w300${rec.poster_path}`
                        : 'https://via.placeholder.com/300x450?text=Sem+imagem'
                    }
                    alt={rec.title}
                    className="w-full h-[300px] object-cover"
                />
                <div className="p-2 text-sm font-medium text-center">{rec.title}</div>
                </Link>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}
