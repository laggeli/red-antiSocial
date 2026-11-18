import { Routes, Route, useLocation } from "react-router-dom";
import { AppNavBar } from "./components/navBar/AppNavBar";
import { Footer } from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Posts from "./pages/postCreation/Posts";
import NotFound from "./pages/notFound/NotFound";
import PostDetail from "./pages/postDetail/PostDetail";
import Explore from "./pages/explore/Explore";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Login from "./pages/login/Login";
import Registro from "./pages/registro/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AnimatedContent from "./components/animatedContent/AnimatedContent";

function MainLayout() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const transitionProps = {
    distance: 100,
    direction: "vertical" as const,
    duration: 1.5,
    ease: "power2.out",
    wipe: "up" as const,
    stagger: 0,
  };

  return (
    <>
      <div id="appShell" data-theme={theme}>
        {user && <AppNavBar user={user} onLogout={logout} />}

        <div className="mainContent">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            <Route
              path="/"
              element={
                <AnimatedContent key={location.pathname} {...transitionProps}>
                  <ProtectedRoute><Home /></ProtectedRoute>
                </AnimatedContent>
              }
            />
            <Route
              path="/profile"
              element={
                <AnimatedContent key={location.pathname} {...transitionProps}>
                  <ProtectedRoute><Profile /></ProtectedRoute>
                </AnimatedContent>
              }
            />
            <Route
              path="/profile/:nickName"
              element={
                <AnimatedContent key={location.pathname} {...transitionProps}>
                  <ProtectedRoute><Profile /></ProtectedRoute>
                </AnimatedContent>
              }
            />
            <Route
              path="/create-post"
              element={
                <AnimatedContent key={location.pathname} {...transitionProps}>
                  <ProtectedRoute><Posts /></ProtectedRoute>
                </AnimatedContent>
              }
            />
            <Route
              path="/post/:id"
              element={
                <AnimatedContent key={location.pathname} {...transitionProps}>
                  <ProtectedRoute><PostDetail /></ProtectedRoute>
                </AnimatedContent>
              }
            />
            <Route
              path="/explore"
              element={
                <AnimatedContent key={location.pathname} {...transitionProps}>
                  <ProtectedRoute><Explore /></ProtectedRoute>
                </AnimatedContent>
              }
            />
            <Route
              path="*"
              element={
                <AnimatedContent key={location.pathname} {...transitionProps}>
                  <NotFound />
                </AnimatedContent>
              }
            />
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
