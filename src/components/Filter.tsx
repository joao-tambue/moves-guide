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
    <div className='flex flex-col items-center gap-3 justify-center py-3 font-sans font-semibold'>
      <div className='flex items-center gap-3 justify-center font-sans flex-wrap'>
        {genres.map(genre => (
          <button
            key={genre}
            className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-[#26272b] rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#23272f] hover:border-[#00DF5E] hover:shadow-lg hover:scale-105 text-white font-medium text-base"
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
