import { AppNavBar } from "./components/navBar/AppNavBar";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <AppNavBar />
      <Profile // provisorio, solo para chusmear el perfil especifico (sacado de la db del repo backend-api)
        nickName="luna"
        onLogout={() => console.log("Cerrar sesión")}
        modoOscuro={false}
      />
    </>
  );
}

export default App;