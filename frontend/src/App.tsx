import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { CardDemo } from "./pages/TestPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { MoviesList } from "./pages/admin/MoviesList";
import { MovieForm } from "./pages/admin/MovieForm";
import { GenresList } from "./pages/admin/GenresList";
import { GenreForm } from "./pages/admin/GenreForm";
import { AuthProvider } from "./hooks/useAuth";

const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/login", Component: Login },
  { path: "/signup", Component: SignUp },
  { path: "/test", Component: CardDemo },
  { path: "/admin", Component: AdminDashboard },
  { path: "/admin/movies", Component: MoviesList },
  { path: "/admin/movies/new", Component: MovieForm },
  { path: "/admin/movies/:id/edit", Component: MovieForm },
  { path: "/admin/genres", Component: GenresList },
  { path: "/admin/genres/new", Component: GenreForm },
  { path: "/admin/genres/:id/edit", Component: GenreForm },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
