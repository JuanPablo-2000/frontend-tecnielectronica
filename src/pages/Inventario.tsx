import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

import "../styles/Inventario.css";

/** Imagenes */
import SalidaTiendaAudio from "../assets/salida-tienda-audio.png";
import CreateInventario from "../assets/plus-sign.png";
import LogOut from "../assets/iniciar-sesion.png";
import Salidas from "../assets/shopping-cart.png";
import Entradas from "../assets/sell.png";
import Consulta from "../assets/exam.png";

/** Material React UI */
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";

import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useForm, Controller, SubmitHandler } from "react-hook-form";

import InventarioServices from "../services/InventarioServices";
import moment from "moment";
import { ConfirmModal } from "./ConfirmModal";

// interfaces
import { Producto, Codigo } from "../interfaces/Selects";
import { Navbar } from "../containers/Navbar";
import { Modales } from "../containers/Modales";
import { IFields } from "../interfaces/Modal";
import { Tables } from "../containers/Tables";
import { Search } from "../containers/Search";

interface Column {
  id: "code" | "product" | "precio" | "fecha" | "salida" | "stock" | "nota";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: Column[] = [
  { id: "code", label: "Code", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 100 },
  { id: "precio", label: "Precio", minWidth: 170 },
  { id: "stock", label: "Stock", minWidth: 170 },
  { id: "nota", label: "Nota", minWidth: 100 },
  { id: "salida", label: "S. Tienda Audio", minWidth: 170 },
  { id: "fecha", label: "Creado En", minWidth: 170 },
];

interface ColumnBusqueda {
  id: "code" | "product" | "precio" | "stock";
  label: string;
  minWidth?: number;
}

const columnsBusqueda: ColumnBusqueda[] = [
  { id: "code", label: "Code", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 170 },
  { id: "precio", label: "Precio", minWidth: 170 },
  { id: "stock", label: "Stock", minWidth: 170 },
];

export interface IPrueba {
  [key: string]: any;
}
const service = new InventarioServices();

export const Inventario = () => {
  const [page, setPage] = useState(0);
  const [pageSearch, setPageSearch] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageSearch, setRowsPerPageSearch] = useState(5);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);

  const [modalCreacion, setModalCreacion] = useState(false);
  const [modalModificar, setModalModificar] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [consulta, setConsulta] = useState({ message: "" });
  const [busqueda, setBusqueda] = useState({ message: "" });
  const [labelForInput, setLabelForInput] = useState<any>({});

  const [skip, setSkip] = useState(0);
  const [skipSearch, setSkipSearch] = useState(0);
  const [inventario, setInventario] = useState<any[]>([]);
  const [inventarioBusqueda, setInventarioBusqueda] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [totalRegisterSearch, setTotalRegisterSearch] = useState<number>(0);
  const [productSelect, setProductSelect] = useState<Producto[]>([]);
  const [codeSelect, setCodeSelect] = useState<any[]>([]);
  const [valor, setValor] = useState<any>();
  const [titulo, setTitulo] = useState<any>();

  const { 
    register, 
    control, 
    handleSubmit, 
    formState, 
    getValues, 
    setValue,
  } =
    useForm<IPrueba>({defaultValues: {stock: 0, product: "", codigo: ""}});

  const navigate = useNavigate();

  const handleChangePage = async (event: unknown, newPage: number) => {
    if (busqueda.message === "") {
      setSkip(newPage * rowsPerPage);
      const infoInventario: any = await service.getInventarioPagination(
        0,
        newPage * rowsPerPage
      );
      setInventario(infoInventario?.content);
      setPage(newPage);
    } else {
      // setSkip(newPage * rowsPerPage);
      const infoInventario: any = await service.getSearchForInventario(
        busqueda.message,
        newPage * rowsPerPage,
        rowsPerPage
      );
      setInventario(infoInventario.content);
      setTotalRegister(infoInventario.total);
      setPage(newPage);
    }
  };

  const handleChangePageSearch = async (event: unknown, newPage: number) => {
    setSkipSearch(newPage * rowsPerPageSearch);
    const data: any = await service.getSearchForInventario(
      consulta.message,
      newPage * rowsPerPageSearch,
      rowsPerPageSearch
    );
    setInventarioBusqueda(data?.content);
    setPageSearch(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeRowsPerPageSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPageSearch(+event.target.value);
    setPageSearch(0);
  };

  const handleOpenModal = (modo?: string, info?: any) => {
    if (modo === "actualizacion") {
      setInfoRow(info);
      setModalModificar(true);
      setModalCreacion(false);
      setModal(true);
      
      setTitulo("Actualizar Inventario");
    } else {
      setInfoRow(null);
      setModalModificar(false);
      setModalCreacion(true);
      setModal(true);

      setTitulo("Crear Inventario");
    }
  };

  const handleOpenModalBusqueda = (modo?: string, info?: any) => {
    if (modo === "actualizacion") {
      setModalModificar(true);
      setModalCreacion(false);
      setModal(true);

      setInfoRow(info);
      setTitulo("Actualizar Inventario");
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    setShowConfirm(false);
    setValor("");
  };

  const handleCloseModalBusqueda = () => {
    setModalBusqueda(false);
  };

  const createInventario = async (data: any) => {
    try {
      let body: any = {};

      
      if (Number(data.salida) > Number(data.stock)) {
        toast.error("No se pueden hacer salidas mayores al Stock", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        if (data.salida == undefined) {
          
          body = {
            code: data.code.toUpperCase(),
            product: data.product.toUpperCase(),
            precio: data.precio,
            stock: Number(data.stock),
            fecha: data.fecha,
            salida: 0,
            nota: data.nota,
          };
        } else {
          console.log(data);
          body = {
            code: data.code.toUpperCase(),
            product: data.product.toUpperCase(),
            precio: data.precio,
            stock: Number(data.stock),
            fecha: data.fecha,
            salida: Number(data.salida),
            nota: data.nota,
          };
          console.log(body);
          
        }
      }

      const response = await service.createInventario(body);
      setInventario([...inventario, response]);
      setModal(false);

      toast.success("Se creo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("No se creo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const updateInventario = async (data: any) => {
    try {
      const id = infoRow._id;

      let body: any = {};

      if (Number(data.Salida) > Number(data.Stock)) {
        toast.error("No se pueden hacer salidas mayores al Stock", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {        
        if (data.salida == undefined) {
          body = {
            code: data.code,
            product: data.product,
            precio: data.precio,
            stock: Number(data.stock),
            fecha: data.fecha,
            salida: 0,
            nota: data.nota,
          };
        } else {
          body = {
            code: data.code.toUpperCase(),
            product: data.product.toUpperCase(),
            precio: data.precio,
            stock: Number(data.stock),
            fecha: data.fecha,
            salida: Number(data.salida),
            nota: data.nota,
          };
        }
      }

      body.especial = true;

      const response = await service.updateInventario(body, id);
      setInventario([...inventario, response]);
      const inventarioInfo: any = await getInventarioForPageable(skip);
      setInventario(inventarioInfo);
      setModal(false);

      toast.success("Se actualizo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("No se actualizo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleConfirmModal = () => {
    setShowConfirm(true);
  };

  const deleteInventario = async () => {
    try {
      const id = infoRow._id;

      const response = await service.deleteInventario(id);
      const inventarioInfo: any = await getInventarioForPageable();
      setInventario(inventarioInfo);
      setModal(false);

      toast.success("Se elimino correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("No se elimino correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setShowConfirm(false);
  };

  const SearchForInventario = async () => {
    if (busqueda.message === "") {
      const response: any = await getInventarioForPageable();
      setInventario(response);
      setPage(0);
    } else {
      const response: any = await service.getSearchForInventario(
        busqueda.message
      );
      setInventario(response.content);
      setTotalRegister(response.total);
    }
  };

  const handleOnKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      if (busqueda.message === "") {
        const response: any = await getInventarioForPageable();
        setInventario(response);
        setPage(0);
      } else {
        const response: any = await service.getSearchForInventario(
          busqueda.message
        );
        setInventario(response.content);
        setTotalRegister(response.total);
        setPage(0);
      }
    }
  };

  const SearchConsultaInventario = async () => {
    if (consulta.message === "") {
      setInventarioBusqueda([]);
    } else {
      const response: any = await service.getSearchForInventario(
        consulta.message,
        skipSearch,
        5
      );
      setTotalRegisterSearch(response.total);
      setInventarioBusqueda(response.content);
      // setConsulta({ message: "" });
    }
  };

  const handelOpenBusqueda = () => {
    setModalBusqueda(true);
  };

  const handleOnChange = (e: any) => {
    setBusqueda({
      message: e.target.value,
    });
  };

  const handleOnKeyPressBusqueda = async (e: any) => {
    if (e.key === "Enter") {
      if (consulta.message === "") {
        setInventarioBusqueda([]);
        setTotalRegisterSearch(0);
      } else {
        const response: any = await service.getSearchForInventario(
          consulta.message,
          skipSearch,
          5
        );
        setTotalRegisterSearch(response.total);
        setInventarioBusqueda(response.content);
      }
    }
  };

  const handleonChangeBusqueda = (e: any) => {
    setConsulta({
      message: e.target.value,
    });
  };

  const fillDataSelect = async () => {
    const infoInventario: any = await service.getAllInventario();

    const dataProduct: Producto[] = [];
    const dataCode: Codigo[] = [];

    infoInventario.map((info: any) => {
      dataProduct.push({ name: info.product });
      dataCode.push({ name: info.code });
    });

    setProductSelect(dataProduct);
    setCodeSelect(dataCode);
  };

  const configInitial = async () => {
    const inventarioInfo: any = await getInventarioForPageable();
    setInventario(inventarioInfo);

    const myDate = moment();

    let info: any = {};

    Object.keys(getValues())?.map((field) => {
      info[field] = {
        id: "outlined-basic",
        error: false,
        variant: "outlined",
        size: "small",
      };
    });
    setLabelForInput(info);
  };

  const getInventarioForPageable = async (offset?: number) => {
    const data: any = await service.getInventarioPagination(
      0,
      offset ? offset : 0
    );

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const onDirectEntrada: any = () => {
    navigate("/entrada");
  };

  const onDirectSalida: any = () => {
    navigate("/salida");
  };

  const onDirectSalidasTiendaAudio: any = () => {
    navigate("/salida-tienda-audio");
  };

  useEffect(() => {
    configInitial();
    fillDataSelect();
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fields: IFields[] = [
    { name: "codigo", label: "Codigos", required: true, type: "autocomplete" },
    { name: "product", label: "Productos", required: true, type: "autocomplete" },
    { name: "stock", label: "Stock", required: true, type: "number" },
    { name: "fecha", label: "Fecha", required: true, type: "date" },
  ];

  return (
    <>
      <Navbar handleCreate={ createInventario }/>

      {modal && (
        <Modales
          tipo="inventario"
          control={control}
          register={register}
          kindModal="cambiar"
          openModal={modal}
          setValuesModal={setValue}
          handleOnClose={() => { setModal(false) }}
          handleOnInitValue={infoRow}
          handleUpdate={handleSubmit(updateInventario)}
          handleDelete={handleSubmit(deleteInventario)}
        />
      )}

      <Search 
        placeholder="Inventarios ..."
        handleOnChange={handleOnChange}
        handleOnKeyPress={handleOnKeyPress}
        valueSearch={busqueda.message}
        searchBy={SearchForInventario}
      />

      {ShowConfirm && (
        <ConfirmModal
          show={true}
          message="Desea eliminar el inventario seleccionado ?"
          onConfirm={deleteInventario}
          onCancel={handleCloseModal}
        />
      )}

      <Tables 
        infoRow={inventario}
        columnas={columns}
        pagina={page}
        totalRegistros={totalRegister}
        filasPorPagina={rowsPerPage}
        handleChangePage={handleChangePage}
        handleOpenModal={handleOpenModal}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />

      
      <ToastContainer />
    </>
  );
};
