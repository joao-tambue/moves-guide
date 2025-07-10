import MovieCard from './MovieCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  rating?: number;
}

interface Props {
  movies: Movie[];
  loading: boolean;
}

export default function MovieList({ movies, loading }: Props) {
  if (loading) {
    // Exibe skeletons enquanto carrega
    return (
      <div className="grid grid-cols-5 gap-6 px-2 py-4">
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
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2 justify-between">
      {movies.map(movie => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
}
