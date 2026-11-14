import { Routes, Route } from "react-router-dom";
import { AppNavBar } from "./components/navBar/AppNavBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Posts from "./pages/postCreation/Posts";
import NotFound from "./pages/notFound/NotFound";
import PostDetail from "./pages/postDetail/PostDetail"; 

function App() {
  const onLogout = () => {
    console.log("Cerrar sesión");
  };

  return (
    <>
      <AppNavBar 
        onLogout={onLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/profile" 
          element={
            <Profile // provisorio, solo para chusmear el perfil especifico (sacado de la db del repo backend-api)
              nickName="luna"               
              modoOscuro={false} 
            />
          } 
        />
        <Route 
          path="/create-post" 
          element={<Posts nickName="luna" />} //momentaneamente
        />
        {/* Agregado del Módulo del Integrante 2: Detalle de publicación */}
        <Route path="/post/:id" element={<PostDetail />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;