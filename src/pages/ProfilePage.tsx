// ProfilePage.tsx
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import bgPerfil from '../assets/image/Rectangle 10.png'
import { Star, FolderX, Trash } from 'lucide-react';
import { api } from '../services/api';

interface RatedMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  rating: number;
}

type User = {
  name: string;
  email: string;
  image?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);
  const [favorites, setFavorites] = useState<RatedMovie[]>([]);
  const [watched, setWatched] = useState<RatedMovie[]>([]);
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);
  const [selectAllFavorites, setSelectAllFavorites] = useState(false);
  // Seleção individual e total favoritos
  const handleSelectFavorite = (id: string) => {
    setSelectedFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSelectAllFavorites = () => {
    if (selectAllFavorites) {
      setSelectedFavorites([]);
      setSelectAllFavorites(false);
    } else {
      setSelectedFavorites(favorites.map((m) => m.imdbID));
      setSelectAllFavorites(true);
    }
  };

  const handleDeleteSelectedFavorites = () => {
    const newFavs = favorites.filter((m) => !selectedFavorites.includes(m.imdbID));
    setFavorites(newFavs);
    setSelectedFavorites([]);
    setSelectAllFavorites(false);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api
      .get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Se houver imagem salva no localStorage, usa ela
        const localImage = localStorage.getItem('profileImage');
        if (localImage) {
          setUser({ ...res.data, image: localImage });
        } else {
          setUser(res.data);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);
  // Função para lidar com upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUser((prev) => prev ? { ...prev, image: base64 } : prev);
      localStorage.setItem('profileImage', base64);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  function getInitials(name: string) {
      const [first, second] = name.trim().split(' ');
      if (second) return `${first[0]}${second[0]}`.toUpperCase();
      return first[0].toUpperCase();
    }

  useEffect(() => {
    const favData = localStorage.getItem('favorites');
    const watchData = localStorage.getItem('watched');
    setFavorites(favData ? JSON.parse(favData) : []);
    setWatched(watchData ? JSON.parse(watchData) : []);
  }, []);

  return (
    <div className="text-white">
      <Navbar />
      <div className="text-white"style={{
        position: 'relative',
        backgroundImage: `url(${bgPerfil})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',    
      }}>
        <div
          style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.50)',
          zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, height: '100%' }}
         className="w-[1150px] mx-auto py-32 flex items-center justify-between">

          {user === null ? (
            <div className="flex gap-4 items-center text-white animate-pulse">
              <div className="relative flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gray-700 border-4 border-[#00DF5E]" />
                <div className="mt-2 h-5 w-20 rounded bg-gray-700" />
              </div>
              <div className="flex gap-4">
                <div className='flex flex-col gap-2'>
                  <div className="h-7 w-40 rounded bg-gray-700" />
                  <div className="h-5 w-32 rounded bg-gray-700" />
                </div>
              </div>
            </div>
          ) : (
            <div className='flex gap-4 items-center text-white'>
              <div className="relative flex flex-col items-center">
                {user.image ? (
                  <img src={user.image} alt='avatar' className='h-24 w-24 rounded-full object-cover border-4 border-[#00DF5E]' />
                ) : (
                  <h1 className='bg-[#00DF5E] h-24 w-24 flex items-center justify-center rounded-full font-bold text-[32px]'>
                    {getInitials(user.name)}
                  </h1>
                )}
                <label className="mt-2 cursor-pointer text-xs bg-[#00DF5E] text-black px-2 py-1 rounded hover:bg-[#00b94a] transition-colors">
                  {uploading ? 'Enviando...' : 'Alterar foto'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="flex gap-4">
                  <div className='flex flex-col'>
                      <h1 className='text-[28px] font-sans font-semibold'>{user.name}</h1>
                      <p className='text-[16px]'>{user.email}</p>
                  </div>
              </div>
            </div>
          )}

          <div className="font-sans flex items-center gap-10">
            <div className="flex flex-col items-center">
              <h1 className="text-[62px] font-bold font-mono text-[#00DF5E]">{
                (() => {
                  const year = new Date().getFullYear();
                  const watchedThisYear = watched.filter(movie => movie.Year === year.toString());
                  const favoritesThisYear = favorites.filter(movie => movie.Year === year.toString());
                  // Usar Set para evitar duplicatas se um filme estiver em ambos
                  const ids = new Set([
                    ...watchedThisYear.map(m => m.imdbID),
                    ...favoritesThisYear.map(m => m.imdbID)
                  ]);
                  return ids.size;
                })()
              }</h1>
              <p className=''>Esse ano</p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-[62px] font-bold font-mono text-[#00DF5E]">{favorites.length}</h1>
              <p className=''>Favoritos</p>
            </div>
          </div>

        </div>

      </div>
      <div className="max-w-6xl mx-auto py-10">

        <section className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold text-white flex gap-2 items-center"> <Star /> Favorit movies</h2>
            <div className='flex items-center gap-2'>
              <label className="flex items-center gap-1 cursor-pointer text-sm">
                <input type="checkbox" checked={selectAllFavorites} onChange={handleSelectAllFavorites} className='' /> Selct all
              </label>
              <button
                className="ml-2 px-3 py-1 text-white disabled:opacity-50"
                onClick={handleDeleteSelectedFavorites}
                disabled={selectedFavorites.length === 0}
              >
                <Trash className='text-red-600' />
              </button>
            </div>
          </div>
          <hr className='mb-4' />
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <FolderX size={48} className="mb-2" />
              <span>Nenhum filme favorito encontrado.</span>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              {favorites.map(movie => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  selectable
                  selected={selectedFavorites.includes(movie.imdbID)}
                  onSelect={() => handleSelectFavorite(movie.imdbID)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

interface MovieCardProps {
  movie: RatedMovie;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

function MovieCard({ movie, selectable, selected, onSelect }: MovieCardProps) {
  return (
    <div className="relative">
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="absolute top-2 left-2 z-10 w-5 h-5 accent-green-500"
        />
      )}
      <div className="rounded-lg text-black overflow-hidden">
        <img src={movie.Poster} alt={movie.Title} className="w-full h-[270px] object-cover" />
        <div className="p-2">
          <h3 className="text-sm font-semibold truncate text-white">{movie.Title}</h3>
          <p className="text-xs text-gray-600">{movie.Year}</p>
          <div className="text-yellow-400">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star}>{star <= movie.rating ? '★' : '☆'}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
