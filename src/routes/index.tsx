// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Movies from "../pages/Movies";
import People from "../pages/People";
import Profile from "../pages/Profile";
import MovieDetails from "../pages/MovieDetails";
import ActorDetails from "../pages/ActorDetails";
import PopularActors from "../pages/PopularActors";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Movies />,
  },
  {
    path: "/people",
    element: <People />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  { 
    path: "/movie/:id",
    element: <MovieDetails /> 
  },
  { 
    path: "/details/:id",
    element: <MovieDetails /> 
  },
  {
    path: "/actor/:id",
    element: <ActorDetails />
  },
  {
    path: "/atores",
    element: <PopularActors />
  },
  {
    path: "/perfil",
    element: <ProfilePage />
  }
]);
