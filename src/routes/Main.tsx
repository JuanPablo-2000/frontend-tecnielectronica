import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { Entrada } from "../pages/Entrada";
import { Salida } from "../pages/Salida";
import { Inventario } from "../pages/Inventario";

import { useEffect, useState } from "react";
import { PrivateRoutes } from "./PrivateRoutes";
import { AppContext } from "../context/AppContext";
import { SalidaTiendaAudio } from "../pages/SalidaTiendaAudio";

const Main = () => {

  const [login, setLogin] = useState();
  const [permission, setPermission] = useState();
  const [mount, setMount] = useState(false);

  // const isRole = async (id: string) => {
  //   const r: any = await serviceRol.getRolById(id);
  // };

  // const userFound = async () => {
  //   const u: any = await serviceUser.getUserByUsername("admin");
  //   isRole(u.roles[0]);
  // };

  useEffect(() => {
    let existToken: any = localStorage.getItem("token");

    if (existToken) {
      setLogin(existToken);
      const rol: any = localStorage.getItem("user");

      setPermission(rol);
    } else {
      localStorage.removeItem("token");
    }
    setMount(true);

  }, []);

  const validateRol = () => {
    const rol: any = localStorage.getItem("user");
    if (rol === "admin") {
      return true;
    } else {
      return false;
    }
  }

  return (
    <AppContext.Provider value={{login, setLogin}}>
      {mount &&
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              element={
                <PrivateRoutes redirectTo="/" isAllowed={login ? true : false} /> }
                >
                <Route path="/entrada" element={ <Entrada /> } />
            </Route>

            <Route
              element={
                <PrivateRoutes redirectTo="/" isAllowed={login ? true : false} /> }
                >
                <Route path="/salida" element={<Salida />} />
            </ Route>

            <Route element={
              <PrivateRoutes redirectTo="/salida" isAllowed={validateRol} /> }
              >
              <Route path="/inventario" element={<Inventario />} />
            </Route>

            <Route element={
              <PrivateRoutes redirectTo="/salida-tienda-audio" isAllowed={true} /> }
              >
              <Route path="/salida-tienda-audio" element={<SalidaTiendaAudio />} />
            </Route>
          </Routes>
        </BrowserRouter>
      }
    </AppContext.Provider>
  );
};

export default Main;
