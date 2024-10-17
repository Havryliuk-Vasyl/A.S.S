import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Catalog from "./pages/Catalog.jsx";
import Authorization from "./pages/Authorization.jsx";
import Profile from "./pages/Profile.jsx";
import Playlist from "./pages/Playlist.jsx";
import { UserProvider } from './context/UserContext.jsx';
import UserProfile from "./pages/User.jsx";
import Album from "./pages/Album.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthWrapper />,
    children: [
      { path: "main_window", element: <Catalog /> },
      { path: "profile", element: <Profile /> },
      { path: "playlist", element: <Playlist />},
      { path: "user", element: <UserProfile/> },
      { path: "album", element: <Album /> },
    ],
  },
  { path: "/auth", element: <Authorization /> },
]);

export default function AppWithRoutes() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
