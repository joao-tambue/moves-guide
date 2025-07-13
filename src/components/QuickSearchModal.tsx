import { useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import Loading from './Loading';
import ActorCardModal from './ActorCardModal';

interface Actor {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onQuickSearch: (name: string) => void;
  results: Actor[];
  loading: boolean;
  notFound: boolean;
}

export default function QuickSearchModal({
  isOpen,
  onClose,
  searchValue,
  onSearchValueChange,
  onSubmit,
  onQuickSearch,
  results,
  loading,
  notFound,
}: Props) {
  const modalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => modalInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickSuggestions = [
    'Tom Hanks',
    'Scarlett Johansson',
    'Denzel Washington',
    'Meryl Streep',
    'Leonardo DiCaprio',
    'Morgan Freeman',
    'Jennifer Lawrence',
    'Brad Pitt',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#18181b] rounded-2xl shadow-2xl w-full max-w-lg p-7 relative animate-fade-in border border-[#23272f]">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-[#00DF5E] transition-colors"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={22} />
        </button>

        <form onSubmit={onSubmit} className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
          <input
            ref={modalInputRef}
            type="text"
            placeholder="Buscar ator pelo nome..."
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-white focus:outline-none focus:ring-2 focus:ring-[#00DF5E] shadow-md transition-all text-base placeholder-gray-400"
          />
        </form>

        <div className="mb-4">
          <span className="text-gray-400 text-xs">Sugestões rápidas:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {quickSuggestions.map((name) => (
              <button
                key={name}
                onClick={() => onQuickSearch(name)}
                className="bg-[#23272f] border border-[#23272f] hover:bg-[#00DF5E] hover:text-black text-gray-200 px-3 py-1 rounded-full text-xs transition-all font-semibold shadow-sm"
                type="button"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loading />
          </div>
        ) : notFound ? (
          <div className="text-center text-gray-500 text-base py-8">Nenhum ator encontrado.</div>
        ) : results.length > 0 ? (
          <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-4">
            {results.map((actor) => (
              <ActorCardModal key={actor.id} actor={actor} onSelect={onClose} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-8">Digite um nome para buscar um ator.</div>
        )}
      </div>
    </div>
  );
}
