import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

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

  useEffect(() => {
    async function fetchActor() {
      try {
        const [actorRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=pt-PT`),
          axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}&language=pt-PT`),
        ]);

        setActor(actorRes.data);
        setMovies(creditsRes.data.cast.slice(0, 10)); // primeiros 10 filmes
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

  if (loading) return <div className="text-white text-xl text-center mt-40">Carregando...</div>;
  if (!actor) return <div className="text-red-500 text-center mt-40">Ator não encontrado</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto text-white p-6">
        <div className="flex gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
            alt={actor.name}
            className="rounded w-[300px] h-auto shadow"
          />
          <div>
            <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
            <p><strong>Gênero:</strong> {actor.gender === 1 ? 'Feminino' : 'Masculino'}</p>
            <p><strong>Data de Nascimento:</strong> {actor.birthday} ({calcularIdade(actor.birthday)} anos de idade)</p>
            <p><strong>Local de Nascimento:</strong> {actor.place_of_birth}</p>
            <p><strong>Aparece em:</strong> {movies.length} filmes</p>
            <p><strong>Também conhecido(a) como:</strong> {actor.also_known_as.join(', ')}</p>
            <p className="mt-4"><strong>Biografia:</strong> {actor.biography || 'Sem biografia disponível.'}</p>
          </div>
        </div>

        <h2 className="text-[25px] font-sans font-semibold text-[#00DF5E] mt-10 mb-4">Filmes em que atuou</h2>
        <div className="grid grid-cols-5 gap-4">
          {movies.map(movie => (
            <div key={movie.id} className="text-center">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=Sem+imagem'}
                alt={movie.title}
                className="w-full h-[300px] object-cover rounded"
              />
              <p className="text-sm mt-2">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}