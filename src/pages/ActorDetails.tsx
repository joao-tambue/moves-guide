import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';

const API_KEY = '9b1d4b5890a9036e5a96c1660cf6c3b9';

interface Actor {
  name: string;
  profile_path: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  gender: number;
  also_known_as: string[];
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    async function fetchActor() {
      try {
        const [actorRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=pt-PT`),
          axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=pt-PT`),
        ]);

        const actorData = actorRes.data;

        // Se a biografia estiver vazia, tenta buscar em inglês
        if (!actorData.biography) {
          const actorEnRes = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`);
          if (actorEnRes.data.biography) {
            actorData.biography = actorEnRes.data.biography;
          }
        }

        setActor(actorData);
        setMovies(creditsRes.data.cast.slice(0, 10));
      } catch (err) {
        console.error('Erro ao buscar dados do ator:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchActor();
  }, [id]);


  if (loading)
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <Loading />
    </div>
  );
  if (!actor) return <div className="text-red-500 text-center mt-40">Ator não encontrado</div>;

  return (
    <>
      <div className="max-w-[1180px] mx-auto text-white px-4 sm:px-6 lg:px-8 py-6">
        <button className='bg-[#23272f] text-white px-4 py-2 mb-4 rounded-md shadow-md hover:bg-[#00DF5E] hover:text-black transition-colors' onClick={() => window.history.back()}>
          <Link to={'/atores'} className="flex items-center gap-2">
            Voltar
          </Link>
        </button>
        <div className='flex flex-col gap-4 justify-between'>
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          <img
            src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
            alt={actor.name}
            className="rounded w-full md:max-w-[300px] h-auto shadow"
          />
          <div className="w-full lg:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
              <p className="mt-4">
                <strong>Biografia:</strong>{" "}
                {actor.biography
                  ? (
                    <>
                      {showFullBio
                        ? actor.biography
                        : actor.biography.length > 400
                          ? actor.biography.slice(0, 400) + "..."
                          : actor.biography
                      }
                      {actor.biography.length > 400 && (
                        <button
                          className="ml-2 text-[#00DF5E] underline"
                          onClick={() => setShowFullBio(!showFullBio)}
                        >
                          {showFullBio ? "Ver menos" : "Ver mais"}
                        </button>
                      )}
                    </>
                  )
                  : "Sem biografia disponível."
                }
              </p>
            </div>
        </div>

          <div className='flex flex-col gap-4'>
            <div className=''>
              <h2 className="text-[25px] font-sans font-semibold text-white mt-10 mb-4">Filmografia</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center">
                {movies.map(movie => (
                  <div
                    key={movie.id}
                    className="relative mt-6 w-full  md:w-[220px] mx-auto rounded-2xl cursor-pointer shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] hover:scale-105 transition-transform duration-300 group"
                  >
                    <Link to={`/movie/${movie.id}`} className="flex flex-col gap-2 items-center w-full">
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=Sem+imagem'}
                        alt={movie.title}
                        className="w-full h-72 object-cover rounded-2xl border-2 border-[#23272f] group-hover:border-[#00DF5E] transition-all duration-300"
                      />
                      <p className="text-sm text-white font-semibold text-center line-clamp-2 pb-4">{movie.title}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
