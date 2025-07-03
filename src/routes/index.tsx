// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Movies from "../pages/Movies";
import People from "../pages/People";
import Profile from "../pages/Profile";

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
]);
