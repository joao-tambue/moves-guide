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

  const calcularIdade = (dataNascimento: string): number => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  if (loading)
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <Loading />
    </div>
  );
  if (!actor) return <div className="text-red-500 text-center mt-40">Ator não encontrado</div>;

  return (
    <>
      <div className="max-w-[1180px] mx-auto text-white p-6">
        <button className='bg-[#23272f] text-white px-4 py-2 mb-4 rounded-md shadow-md hover:bg-[#00DF5E] hover:text-black transition-colors' onClick={() => window.history.back()}>
          <Link to={`/movie`} className="flex items-center gap-2">
            Voltar
          </Link>
        </button>
        <div className='flex flex-col gap-4 justify-between'>
        <div className="flex gap-4">
          <img
            src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
            alt={actor.name}
            className="rounded w-[400px] h-[533px] shadow"
          />
          {/* <div className='text-[25px] font-sans font-semibold text-white mt-10 mb-4'>
            <h1 className='pb-4'>Informações Pessoai</h1>
            <div className='text-white text-[16px] flex flex-col gap-4'>
              <p><strong>Gênero:</strong> {actor.gender === 1 ? 'Feminino' : 'Masculino'}</p>
              <p><strong>Data de Nascimento:</strong> {actor.birthday} ({calcularIdade(actor.birthday)} anos de idade)</p>
              <p><strong>Local de Nascimento:</strong> {actor.place_of_birth}</p>
              <p><strong>Aparece em:</strong> {movies.length} filmes</p>
              <p><strong>Também conhecido(a) como:</strong><br />
                {actor.also_known_as.length > 0 ? (
                  actor.also_known_as.map((nome, idx) => (
                    <span key={idx}>
                      {nome}{idx < actor.also_known_as.length - 1 && <>,<br /></>}
                    </span>
                  ))
                ) : (
                  <span>Sem outros nomes.</span>
                )}
              </p>
            </div>
          </div> */}
          <div>
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
            {/* <div>
              <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
              <p className="mt-4">
                <strong>Biografia:</strong> {actor.biography || 'Sem biografia disponível.'}
              </p>
            </div> */}
            <div className=''>
              <h2 className="text-[25px] font-sans font-semibold text-white mt-10 mb-4">Filmografia</h2>
              <div className="grid grid-cols-5 gap-6 justify-center">
                {movies.map(movie => (
                  <div
                    key={movie.id}
                    className="relative mt-6 w-[220px] mx-auto rounded-2xl cursor-pointer shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] hover:scale-105 transition-transform duration-300 group"
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
