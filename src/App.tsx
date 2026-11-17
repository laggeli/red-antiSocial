import { Routes, Route } from "react-router-dom";
import { AppNavBar } from "./components/navBar/AppNavBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Posts from "./pages/postCreation/Posts";
import NotFound from "./pages/notFound/NotFound";
import PostDetail from "./pages/postDetail/PostDetail";

// importaciones del módulo de autenticación (verificar minúsculas en las rutas de carpetas)
import Login from "./pages/login/Login";
import Registro from "./pages/registro/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      {/* La barra de navegación se renderiza únicamente cuando el usuario inició sesión */}
      {user && <AppNavBar onLogout={logout} />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create-post" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}