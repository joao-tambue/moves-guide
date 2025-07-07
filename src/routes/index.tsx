// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Movies from "../pages/Movies";
import People from "../pages/People";
import Profile from "../pages/Profile";
import MovieDetails from "../pages/MovieDetails";
import ActorDetails from "../pages/ActorDetails";
import PopularActors from "../pages/PopularActors";
import ProfilePage from "../pages/ProfilePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { PrivateRoute } from "./PrivateRoute"; // importa o wrapper

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Movies />,
  },
  {
    path: "/people",
    element: (
      <PrivateRoute>
        <People />
      </PrivateRoute>
    ),
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
    element: <MovieDetails />,
  },
  {
    path: "/actor/:id",
    element: <ActorDetails />,
  },
  {
    path: "/atores",
    element: (
      <PrivateRoute>
        <PopularActors />
      </PrivateRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/cadastro",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
