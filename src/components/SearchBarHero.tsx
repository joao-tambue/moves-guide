import { Search } from 'lucide-react';
import iconeMovie from '../assets/icon/image.png';
import Filter from './Filter';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  searchTerm: string;
  onSearch: (term: string) => void;
  onSelectGenre: (genre: string) => void;
}

export default function SearchBarHero({ searchTerm, onSearch, onSelectGenre }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top left, #23272f 60%, #111112 100%)',
        minHeight: '80vh',
        height: '80vh',
        maxHeight: '80vh',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'repeating-radial-gradient(circle at 40% 30%, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.01) 2px, transparent 3px, transparent 100px)',
          opacity: 0.7,
        }}
      />

      <div className='relative py-28 md:-mt-36 lg:-mt-[70px] pb-0 sm:min-h-screen justify-center sm:pb-7 flex flex-col items-center px-4 sm:px-10 md:px-20 lg:px-40 xl:px-[200px] z-10 text-center'>
        <div className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[44px] xl:text-[50px] text-white font-poppins font-bold leading-tight drop-shadow-lg">
          <div className="block md:hidden">
            <div className="flex items-center justify-center mb-3">
              <img src={iconeMovie} alt="icon" className="h-20 w-20" />
            </div>

            <p>Descubra filmes incríveis</p>
          </div>
          <span className="hidden md:block">Explore o universo do cinema: encontre, descubra e se inspire!</span>
        </div>

        <div className="relative w-full max-w-[600px] py-6 pb-0">
          <input
            ref={inputRef}
            type="search"
            placeholder="Search a title"
            className="w-full h-14 text-sm pl-4 pr-10 py-3 mb-4 rounded-2xl border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm placeholder:text-gray-400"
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
            autoComplete="off"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 pointer-events-none" size={18} />
        </div>

        {/* Filter */}
        <AnimatePresence>
          <motion.div
            key="filter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <div className='hidden sm:block'>
              <p className='text-white text-sm sm:text-base'>FILTER BY:</p>
            </div>
            <Filter onSelectGenre={onSelectGenre} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
