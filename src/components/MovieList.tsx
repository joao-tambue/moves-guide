import MovieCard from './MovieCard';
import Loading from './Loading';

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
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-white text-xl"><Loading /></span>
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
