import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Catalog from "./pages/Catalog.jsx";
import Authorization from "./pages/Authorization.jsx";
import Profile from "./pages/Profile.jsx";
import Playlist from "./pages/Playlist.jsx";
import { UserProvider } from './context/UserContext.jsx';
import UserProfile from "./pages/User.jsx";
import Album from "./pages/Album.jsx";
import Settings from "./pages/Settings.jsx";
import Search from "./pages/Search.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import EditAccounts from "./pages/Admin/EditAccounts.jsx";
import ReviewRequests from "./pages/Admin/ReviewRequests.jsx";
import EditUser from "./pages/Admin/EditUser.jsx";
import Artist from "./pages/ArtistPanel/Artist.jsx";
import UserAlbums from "./pages/ArtistPanel/UserAlbums.jsx";
import UploadAlbum from "./pages/ArtistPanel/uploadAlbum.jsx";
import ArtistAlbumEdit from "./pages/ArtistPanel/ArtistAlbumEdit.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <AuthWrapper />,
    children: [
      { path: "main_window", element: <Catalog /> },
      { path: "profile", element: <Profile /> },
      { path: "playlist", element: <Playlist /> },
      { path: "user", element: <UserProfile /> },
      { path: "album", element: <Album /> },
      { path: "settings", element: <Settings /> },
      { path: "search", element: <Search /> },
    ],
  },
  { path: "/auth", element: <Authorization /> },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "edit-accounts", element: <EditAccounts /> },
      { path: "review-requests", element: <ReviewRequests /> },
      { path: "edit-user", element: <EditUser /> },
    ]
  },
  {
    path: "/artist",
    element: <Artist />,
    children: [
      { path: "user-albums", element: <UserAlbums /> },
      { path: "album-edit", element: <ArtistAlbumEdit /> },
      { path: "upload-album", element: <UploadAlbum /> },
    ]
  }
]);

export default function AppWithRoutes() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
