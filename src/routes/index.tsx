// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Movies from "../pages/Movies";
import Profile from "../pages/Profile";
import MovieDetails from "../pages/MovieDetails";
import ActorDetails from "../pages/ActorDetails";
import PopularActors from "../pages/PopularActors";
import ProfilePage from "../pages/ProfilePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
// import { PageTransition } from '../components/PageTransition';
import { PrivateRoute } from "./PrivateRoute"; // importa o wrapper

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/movie/:id",
    element: <MovieDetails />,
  },
  {
    path: "/details/:id",
    element:(
      <PrivateRoute>
       <MovieDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/actor/:id",
    element: (
      <PrivateRoute>
    <ActorDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/atores",
    element: (
        <PopularActors />
    ),
  },
  {
    path: "/perfil",
    element: (
        <ProfilePage />
    ),
  },
  {
    path: "/cadastro",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Movies />,
  },
]);
