import { Routes, Route } from "react-router-dom";
import Login from "./componentes/login";
import Mapa from "./componentes/mapa";
import TabelaPontos from "./componentes/lista";
import Register from "./componentes/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Registro" element={<Register />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/lista" element={<TabelaPontos />} />
    </Routes>
  );
}

export default App;
