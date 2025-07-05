import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_KEY = '9b1d4b5890a9036e5a96c1660cf6c3b9';

interface Actor {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
}

export default function PopularActors() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPopularActors() {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=pt-PT&page=${page}`);
        setActors(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error('Erro ao buscar atores populares:', err);
      }
    }

    fetchPopularActors();
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-[#00DF5E] mb-8">Pessoas populares</h1>
        <div className="grid grid-cols-4 gap-6">
          {actors.slice(0, 24).map(actor => (
            <Link to={`/actor/${actor.id}`} key={actor.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                    : 'https://via.placeholder.com/300x450?text=Sem+foto'
                }
                alt={actor.name}
                className="w-full h-[300px] object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-black truncate">{actor.name}</h2>
                <p className="text-sm text-gray-600">{actor.known_for_department}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center mt-10 gap-4 text-white">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="text-2xl disabled:opacity-50"
            disabled={page === 1}
          >⬅️</button>
          <span className="text-xl">Página {page}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            className="text-2xl disabled:opacity-50"
            disabled={page === totalPages}
          >➡️</button>
        </div>
      </div>
    </>
  );
}
