import Profile from "./pages/profile/Profile";

function App() {
  return (
      <Profile
        nickName="usuarioPrueba"
        onLogout={() => console.log("Cerrar sesión")}
        modoOscuro={false}
      />
  );
}

export default App;