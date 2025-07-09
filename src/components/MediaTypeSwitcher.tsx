interface Props {
  setMediaType: (type: 'movie' | 'series') => void;
}

export default function MediaTypeSwitcher({ setMediaType }: Props) {
  return (
    <div className="flex gap-4 my-4 justify-center">
      <button onClick={() => setMediaType('movie')} className="bg-white px-4 py-2 rounded hover:bg-[#00DF5E]">Filmes</button>
      <button onClick={() => setMediaType('series')} className="bg-white px-4 py-2 rounded hover:bg-[#00DF5E]">Séries</button>
    </div>
  );
}
