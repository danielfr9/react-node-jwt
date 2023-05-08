import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Refresh from "./pages/Refresh";
import Me from "./pages/Me";
import Register from "./pages/Register";
import AuthProvider from "./context/AuthProvider";
import PersistLogin from "./components/PersistLogin";
import AuthRequired from "./components/AuthRequired";
import GuestOnly from "./components/GuestOnly";
import Landing from "./pages/Landing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "",
        // TODO: Extract to a wrapper component
        element: <PersistLogin />,
        children: [
          {
            path: "/",
            element: <Landing />,
          },
          {
            path: "",
            element: <GuestOnly />,
            children: [
              {
                path: "/register",
                element: <Register />,
              },
              {
                path: "/login",
                element: <Login />,
              },
            ],
          },
          {
            path: "",
            element: <AuthRequired />,
            children: [
              {
                path: "/dashboard",
                element: <Dashboard />,
              },
              {
                path: "/refresh",
                element: <Refresh />,
              },
              {
                path: "/me",
                element: <Me />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// {
//   path: "/",
//   element: <h1>Landing Page</h1>,
// },
// {
//   path: "/register",
//   element: <Register />,
// },
// {
//   path: "/login",
//   element: <Login />,
// },
