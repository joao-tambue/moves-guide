
import { Search } from 'lucide-react';
import Filter from './Filter';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


interface Props {
  searchTerm: string;
  onSearch: (term: string) => void;
  onSelectGenre: (genre: string) => void;
}
export default function SearchBarHero({ searchTerm, onSearch, onSelectGenre }: Props) {
  // sugestões removidas
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background:'radial-gradient(ellipse at top left, #23272f 60%, #111112 100%)',
        minHeight: '80vh',
        height: '80vh',
        maxHeight: '80vh',
      }}
    >
      {/* Overlay para textura sutil */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'repeating-radial-gradient(circle at 40% 30%, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.01) 2px, transparent 3px, transparent 100px)',
          opacity: 0.7,
        }}
      />
      {/* Conteúdo principal */}
      <div className='relative min-h-screen justify-center pb-7 flex flex-col items-center px-[200px] z-10'>
        <h1 className="text-[50px] text-white font-poppins font-bold text-center leading-tight drop-shadow-lg">
          Explore o universo do cinema: encontre, descubra e se inspire!
        </h1>
        <div className="relative w-[600px] item-center py-6 pb-0">
          <input
            ref={inputRef}
            type="search"
            placeholder="Search a title"
            className="w-full h-14 text-sm pl-4 pr-10 py-3 mb-4 rounded-2xl border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm placeholder:text-gray-400"
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
            autoComplete="off"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-4 text-green-600 pointer-events-none" size={18} />
        </div>
        
        {/* Filter só aparece se não estiver mostrando sugestões */}
        <AnimatePresence>
          
            <motion.div
              key="filter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
            >

              <p className='text-center text-white'>FILTER BY:</p>
              <Filter onSelectGenre={onSelectGenre} />
              
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
