import { Routes, Route } from "react-router-dom";
import { AppNavBar } from "./components/navBar/AppNavBar";
import { Footer } from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Posts from "./pages/postCreation/Posts";
import NotFound from "./pages/notFound/NotFound";
import PostDetail from "./pages/postDetail/PostDetail";
import Explore from "./pages/explore/Explore";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// importaciones del módulo de autenticación (verificar minúsculas en las rutas de carpetas)
import Login from "./pages/login/Login";
import Registro from "./pages/registro/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

function MainLayout() {
  const { user, logout } = useAuth();
   const { theme } = useTheme();

  return (
    <>
      <div id="appShell" data-theme={theme}>
        {user && <AppNavBar user={user} onLogout={logout} />}

        <div className="mainContent">
          <Routes>
            <Route path="/login" element= { <Login /> } />
            <Route path="/registro" element= { <Registro /> } />
            <Route path="/" element= { <ProtectedRoute> <Home /> </ProtectedRoute> } />
            <Route path="/profile" element= { <ProtectedRoute> <Profile /> </ProtectedRoute> } />
            <Route path="/profile/:nickName" element= { <ProtectedRoute> <Profile /> </ProtectedRoute> }/>
            <Route path="/create-post" element= { <ProtectedRoute> <Posts /> </ProtectedRoute> } />
            <Route path="/post/:id" element= { <ProtectedRoute> <PostDetail /> </ProtectedRoute> } />
            <Route path="/explore" element= { <ProtectedRoute> <Explore /> </ProtectedRoute> } />
            <Route path="*" element= { <NotFound /> } />
          </Routes>
      </div>
      
      {user && <Footer />}
    </div>  
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}