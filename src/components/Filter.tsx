interface FilterProps {
  onSelectGenre: (genre: string) => void;
}

const genres = [
  'Todos', 'Ação', 'Aventura', 'Animação', 'Comédia', 'Crime', 'Documentário',
  'Drama', 'Família', 'Fantasia', 'História', 'Terror', 'Música', 'Dorama',
  'Mistério', 'Romance', 'Ficção científica', 'Cinema TV', 'Thriller', 'Guerra', 'Faroeste'
];

export default function Filter({ onSelectGenre }: FilterProps) {
  return (
    <div className='hidden md:flex flex-col items-center gap-3 justify-center py-3 font-sans font-semibold w-full'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-2 sm:gap-3 px-2'>
        {genres.map(genre => (
          <button
            key={genre}
            className="px-3 py-2 bg-[#18181b] border border-[#26272b] rounded-md shadow-sm transition-all duration-300 ease-in-out hover:bg-[#23272f] hover:border-[#00DF5E] hover:shadow-lg text-white text-sm sm:text-base whitespace-nowrap"
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}