import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import "./index.css"

import router from "./routes/AppRouter.jsx"

import AuthProvider from "./context/AuthContext.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

// we use StrictMode to:
// lets you find common bugs in your components early during development.
ReactDOM.createRoot(document.getElementById("root")).render( //fetches the html where id is root.
  <GoogleOAuthProvider
    clientId={
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }
  >
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
)

//Layer of authorization applied arround RouterProvider
