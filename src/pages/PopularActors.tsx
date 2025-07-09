import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import Loading from '../components/Loading';

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
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalResults, setModalResults] = useState<Actor[]>([]);
  const [modalNotFound, setModalNotFound] = useState(false);
  const modalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searching) return;
    setLoading(true);
    setNotFound(false);
    async function fetchPopularActors() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=pt-PT&page=${page}`
        );
        setActors(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch {
        console.error('Erro ao buscar atores populares.');
      } finally {
        setLoading(false);
      }
    }
    fetchPopularActors();
  }, [page, searching]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setModalOpen(true);
        setTimeout(() => modalInputRef.current?.focus(), 100);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!search.trim()) {
      setSearching(false);
      setSearchResults([]);
      setNotFound(false);
      return;
    }
    setSearching(true);
    setLoading(true);
    setNotFound(false);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=pt-PT&query=${encodeURIComponent(
          search
        )}&page=1&include_adult=false`
      );
      setSearchResults(res.data.results);
      setNotFound(res.data.results.length === 0);
    } catch {
      setSearchResults([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleModalSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modalSearch.trim()) {
      setModalResults([]);
      setModalNotFound(false);
      return;
    }
    setModalLoading(true);
    setModalNotFound(false);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=pt-PT&query=${encodeURIComponent(
          modalSearch
        )}&page=1&include_adult=false`
      );
      setModalResults(res.data.results);
      setModalNotFound(res.data.results.length === 0);
    } catch {
      setModalResults([]);
      setModalNotFound(true);
    } finally {
      setModalLoading(false);
    }
  }

  async function handlePredefinedSearch(name: string) {
    setModalSearch(name);
    setModalLoading(true);
    setModalNotFound(false);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=pt-PT&query=${encodeURIComponent(
          name
        )}&page=1&include_adult=false`
      );
      setModalResults(res.data.results);
      setModalNotFound(res.data.results.length === 0);
    } catch {
      setModalResults([]);
      setModalNotFound(true);
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      {/* Modal de busca por atalho Ctrl+K */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
              aria-label="Fechar"
            >
              <X size={22} />
            </button>
            <form onSubmit={handleModalSearch} className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <input
                ref={modalInputRef}
                type="text"
                placeholder="Buscar ator pelo nome..."
                value={modalSearch}
                onChange={e => {
                  setModalSearch(e.target.value);
                  if (!e.target.value) {
                    setModalResults([]);
                    setModalNotFound(false);
                  }
                }}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all text-sm"
              />
            </form>
            <div className="mb-4">
              <span className="text-gray-500 text-xs">Sugestões rápidas:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  'Tom Hanks',
                  'Scarlett Johansson',
                  'Denzel Washington',
                  'Meryl Streep',
                  'Leonardo DiCaprio',
                  'Morgan Freeman',
                  'Jennifer Lawrence',
                  'Brad Pitt',
                ].map((name: string) => (
                  <button
                    key={name}
                    className="bg-gray-100 hover:bg-[#00DF5E] hover:text-white text-gray-700 px-3 py-1 rounded-full text-xs transition"
                    onClick={() => handlePredefinedSearch(name)}
                    type="button"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            {/* Modal resultados */}
            {modalLoading ? (
              <div className="flex justify-center items-center h-32"><Loading /></div>
            ) : modalNotFound ? (
              <div className="text-center text-gray-500 text-base py-8">Nenhum ator encontrado.</div>
            ) : modalResults.length > 0 ? (
              <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-4">
                {modalResults.map(actor => (
                  <Link
                    to={`/actor/${actor.id}`}
                    key={actor.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 hover:bg-[#00DF5E]/20 transition"
                    onClick={() => setModalOpen(false)}
                  >
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w92${actor.profile_path}` : 'https://via.placeholder.com/92x138?text=Sem+foto'}
                      alt={actor.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-semibold text-black text-sm truncate">{actor.name}</div>
                      <div className="text-xs text-gray-500">{actor.known_for_department}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm py-8">Digite um nome para buscar um ator.</div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-8 translate-y-28">
        <form
          onSubmit={handleSearch}
          className="mb-8 w-full max-w-md mx-auto relative"
        >
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar ator pelo nome..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!e.target.value) {
                setSearching(false);
                setSearchResults([]);
              }
            }}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all text-sm"
          />
          <h1
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            >
              Press Ctrl + K para buscar
          </h1>
        </form>

        <h1 className="text-3xl font-bold text-[#00DF5E] mb-8">Pessoas populares</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64"><Loading /></div>
        ) : notFound ? (
          <div className="text-center text-gray-500 text-xl py-16">Nenhum ator encontrado.</div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {(searching ? searchResults : actors.slice(0, 24)).map(actor => (
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
        )}

        {!searching && (
          <div className="flex justify-center items-center mt-10 gap-4 text-white">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="text-2xl disabled:opacity-50"
              disabled={page === 1}
            ><ChevronLeft /></button>
            <span className="text-xl">Page {page}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="text-2xl disabled:opacity-50"
              disabled={page === totalPages}
            ><ChevronRight /></button>
          </div>
        )}
      </div>
    </>
  );
}
