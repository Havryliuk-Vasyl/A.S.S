import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Catalog from "./pages/Catalog.jsx";
import Authorization from "./pages/Authorization.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthWrapper />,
    children: [
      { path: "main_window", element: <Catalog /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  { path: "/auth", element: <Authorization /> },
]);

export default function AppWithRoutes() {
  return <RouterProvider router={router} />;
}
