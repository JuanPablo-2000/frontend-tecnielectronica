import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Image
import Ventas from "../assets/sell.png";
import Consulta from "../assets/exam.png";
import Agregar from "../assets/plus-sign.png";
import Inventario from "../assets/budget.png";
import Entrada from "../assets/shopping-cart.png"
import LogOut from "../assets/iniciar-sesion.png";
import TiendaAudio from "../assets/salida-tienda-audio.png"
import { Modales } from './Modales';
import { useForm } from 'react-hook-form';
import { Consultas } from './Consultas';
import { INavbar } from '../interfaces/Modal';


export const Navbar = ({
  handleCreate
} : INavbar) => {

  const [permission, setPermission] = useState(false);
  const [inventario, setInventario] = useState(false);
  const [entrada, setEntrada] = useState(false);
  const [salida, setSalida] = useState(false);
  const [salidaTiendaAudio, setSalidaTiendaAudio] = useState(false);
  const [modalConsulta, setModalConsulta] = useState(false);
  const [modal, setModal] = useState(false);
  const [tipo, setTipo] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { register, control, handleSubmit, getValues } = useForm();

  const configInitial = () => {
    let userPermission: any = localStorage.getItem("user");

    if(userPermission === "admin") {
      setPermission(true);
    } else {
      setPermission(false);
    }    

    if (location.pathname.slice(1) === 'inventario') {
      setTipo('inventario');
      setInventario(false);
      setSalida(true);
      setEntrada(true);
      setSalidaTiendaAudio(true);
      
    }
    if (location.pathname.slice(1) === 'entrada') {
      setTipo('entrada');
      setEntrada(false);
      setInventario(true);
      setSalida(true);
      setSalidaTiendaAudio(true);
    }
    if (location.pathname.slice(1) === 'salida') {
      setTipo('salida');
      setSalida(false);
      setInventario(true);
      setEntrada(true);
      setSalidaTiendaAudio(true);
    }
    if (location.pathname.slice(1) === 'salida-tienda-audio') {
      setTipo('salida-tienda-audio');
      setSalidaTiendaAudio(false);
      setInventario(true);
      setEntrada(true);
      setSalida(true);
    }
  }

  useEffect(() => {
    configInitial();
  }, [])

  useEffect(() => {
  }, [modalConsulta])
  

  const handleCloseModalConsulta = () => {
    setModalConsulta(false);
  }

  const handleOpenModalConsulta = () => {
    setModal(true);
  }

  const agregar: any = () => {
    setModal(true);
  }

  const consulta = () => {
    setModalConsulta(true);
  }
  
  const onDirectEntrada: any = () => {
    navigate("/entrada");
  };

  const onDirectSalida: any = () => {
    navigate("/salida");
  };

  const onDirectSalidasTiendaAudio: any = () => {
    navigate("/salida-tienda-audio");
  }

  const onDirectInventario = () => {
    navigate("/inventario");
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <>
      <nav className="nav-bar">

        <div className='create-button' onClick={agregar}>
          <img src={Agregar} alt="" />
          <h3>Agregar</h3>
        </div>
        
        {inventario &&
          <div className='create-button' onClick={onDirectInventario}>
            <img src={Inventario} alt="" />
            <h3>Inventario</h3>
          </div>
        }

        {entrada &&
          <div className="entrada-button" onClick={onDirectEntrada}>
            <img src={Entrada} alt="" />
            <h2>Entradas</h2>
          </div>
        }

        {salida &&
          <div className='create-button' onClick={onDirectSalida}>
            <img src={Ventas} alt="" />
            <h3>Ventas</h3>
          </div>
        }

        <div className='create-button' onClick={consulta}>
          <img src={Consulta} alt=""/>
          <h3>Consultar</h3>
        </div>
        
        {salidaTiendaAudio &&
          <div className='salidas-tienda-audio-button' onClick={onDirectSalidasTiendaAudio}>
            <img src={TiendaAudio} alt="" />
            <h3>Tienda Audio</h3>
          </div>
        }

        <div className='create-button' onClick={logOut}>
          <img src={LogOut} alt="" />
          <h3>Log Out</h3>
        </div>

      </nav>

      {modal && (
        <Modales 
          tipo={location.pathname.slice(1)}
          control={control}
          register={register}
          kindModal='crear'
          openModal={modal}
          handleCreate={ handleSubmit(handleCreate) }
          handleOnClose={() => { setModal(false) }}
          handleOnInitValue={async () => {}}
        />
      )}

      <Consultas 
        openConsulta={modalConsulta}
        onClose={handleCloseModalConsulta}
        handleOpenModal={() => handleOpenModalConsulta}
      />
    </>
  )
}
