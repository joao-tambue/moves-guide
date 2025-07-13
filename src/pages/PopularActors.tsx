import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import QuickSearchModal from '../components/QuickSearchModal';

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
  const [imgLoaded, setImgLoaded] = useState(false);

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
      <QuickSearchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        searchValue={modalSearch}
        onSearchValueChange={(value) => {
          setModalSearch(value);
          if (!value) {
            setModalResults([]);
            setModalNotFound(false);
          }
        }}
        onSubmit={handleModalSearch}
        onQuickSearch={handlePredefinedSearch}
        results={modalResults}
        loading={modalLoading}
        notFound={modalNotFound}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 translate-y-28">
        <form
          onSubmit={handleSearch}
          className="mb-6 sm:mb-8 w-full max-w-md mx-auto relative"
        >

          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
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
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-white focus:outline-none focus:ring-2 focus:ring-[#00DF5E] shadow-md transition-all text-base placeholder-gray-400"
          />
          <h1 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            Press Ctrl + K
          </h1>
        </form>

        <h1 className="text-3xl font-bold text-[#00DF5E] mb-8 font-sans drop-shadow-lg">
          Pessoas populares
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-2 py-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-zinc-800 rounded-xl shadow-lg flex flex-col items-center p-4 border border-zinc-700 animate-pulse"
              >
                <Skeleton
                  height={300}
                  width={200}
                  borderRadius={12}
                  baseColor="#27272a"
                  highlightColor="#3f3f46"
                  className="mb-4"
                />
                <Skeleton
                  height={28}
                  width={160}
                  borderRadius={8}
                  baseColor="#27272a"
                  highlightColor="#3f3f46"
                  className="mb-2"
                />
                <Skeleton
                  height={18}
                  width={90}
                  borderRadius={6}
                  baseColor="#27272a"
                  highlightColor="#3f3f46"
                />
              </div>
            ))}
          </div>
        ) : notFound ? (
          <div className="text-center text-gray-500 text-xl py-16">
            Nenhum ator encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {(searching ? searchResults : actors.slice(0, 24)).map((actor) => {
              
              return (
                <Link
                  to={`/actor/${actor.id}`}
                  key={actor.id}
                  className="relative mt-6 w-full rounded-2xl cursor-pointer shadow-lg bg-gradient-to-br from-[#181818] to-[#23272f] border border-[#23272f] hover:scale-105 transition-transform duration-300 group overflow-hidden"
                >
                  <div className="relative w-full h-[300px] rounded-2xl overflow-hidden">
                    {!imgLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#23272f] animate-pulse z-10">
                        <svg className="w-10 h-10 text-[#00DF5E] animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      </div>
                    )}
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                          : 'https://via.placeholder.com/300x450?text=Sem+foto'
                      }
                      alt={actor.name}
                      className="w-full h-[300px] object-cover rounded-2xl border-2 border-[#23272f] group-hover:border-[#00DF5E] transition-all duration-300"
                      loading="lazy"
                      onLoad={() => setImgLoaded(true)}
                    />
                  </div>
                  <div className="py-4 px-2 text-white text-center">
                    <h2 className="font-bold text-[18px] truncate mb-1 drop-shadow-lg">
                      {actor.name}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1 drop-shadow">
                      {actor.known_for_department}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!searching && (
          <div className="flex justify-center items-center mt-10 gap-4 text-white">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="text-2xl disabled:opacity-50 bg-[#23272f] rounded-full p-2 hover:bg-[#00DF5E] hover:text-black transition-colors"
              disabled={page === 1}
            >
              <ChevronLeft />
            </button>
            <span className="text-xl">Page {page}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="text-2xl disabled:opacity-50 bg-[#23272f] rounded-full p-2 hover:bg-[#00DF5E] hover:text-black transition-colors"
              disabled={page === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}