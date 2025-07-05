// ProfilePage.tsx
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface RatedMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  rating: number;
}

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<RatedMovie[]>([]);
  const [watched, setWatched] = useState<RatedMovie[]>([]);

  useEffect(() => {
    const favData = localStorage.getItem('favorites');
    const watchData = localStorage.getItem('watched');
    setFavorites(favData ? JSON.parse(favData) : []);
    setWatched(watchData ? JSON.parse(watchData) : []);
  }, []);

  return (
    <div className="text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6">Meu Perfil</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#00DF5E] mb-4">⭐ Favoritos</h2>
          <div className="grid grid-cols-6 gap-4">
            {favorites.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#00DF5E] mb-4">👁️ Assistidos</h2>
          <div className="grid grid-cols-6 gap-4">
            {watched.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MovieCard({ movie }: { movie: RatedMovie }) {
  return (
    <div className="bg-white rounded-lg text-black overflow-hidden">
      <img src={movie.Poster} alt={movie.Title} className="w-full h-[270px] object-cover" />
      <div className="p-2">
        <h3 className="text-sm font-semibold truncate">{movie.Title}</h3>
        <p className="text-xs text-gray-600">{movie.Year}</p>
        <div className="text-yellow-400">
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star}>{star <= movie.rating ? '★' : '☆'}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
