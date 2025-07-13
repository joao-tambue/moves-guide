// components/ActorCardModal.tsx
import { Link } from 'react-router-dom';

interface Props {
  actor: {
    id: number;
    name: string;
    profile_path: string;
    known_for_department: string;
  };
  onSelect: () => void;
}

export default function ActorCardModal({ actor, onSelect }: Props) {
  return (
    <Link
      to={`/actor/${actor.id}`}
      onClick={onSelect}
      className="flex items-center gap-3 bg-[#18181b] border border-[#23272f] rounded-xl p-2 hover:bg-[#00DF5E]/20 transition shadow group"
    >
      <img
        src={
          actor.profile_path
            ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
            : 'https://via.placeholder.com/92x138?text=Sem+foto'
        }
        alt={actor.name}
        className="w-12 h-16 object-cover rounded-xl border-2 border-[#23272f] group-hover:border-[#00DF5E] transition-all duration-300"
      />
      <div>
        <div className="font-bold text-white text-sm truncate drop-shadow-lg">{actor.name}</div>
        <div className="text-xs text-gray-400">{actor.known_for_department}</div>
      </div>
    </Link>
  );
}
