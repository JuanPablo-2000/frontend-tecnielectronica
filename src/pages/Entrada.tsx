import React, { useEffect, useState } from "react";

import "../styles/Entrada.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useForm, Controller, SubmitHandler } from "react-hook-form";

import EntradaServices from "../services/EntradaServices";
import InventarioServices from "../services/InventarioServices";
import { ConfirmModal } from "./ConfirmModal";
import { Navbar } from "../containers/Navbar";
import { Modales } from "../containers/Modales";
import { IPrueba } from "./Inventario";
import { Tables } from "../containers/Tables";
import { Search } from "../containers/Search";

interface Column {
  id: "code" | "product" | "quantity" | "creado";
  label: string;
  minWidth?: number;
}

const columns: Column[] = [
  { id: "code", label: "Codigo", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 170 },
  { id: "quantity", label: "Cantidad", minWidth: 170 },
  { id: "creado", label: "Dia entrada", minWidth: 170 },
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

const service = new EntradaServices();
const serviceInventario = new InventarioServices();

export const Entrada = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);

  const [busqueda, setBusqueda] = useState({ message: "" });
  const [entrada, setEntrada] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [valorCodigo, setValorCodigo] = useState<any>();
  const [valorCantidad, setValorCantidad] = useState<any>();
  const [valorFecha, setValorFecha] = useState<any>();
  const [valor, setValor] = useState<any>();

  const { register, control, handleSubmit, formState, getValues, setValue } =
    useForm<IPrueba>({
      defaultValues: {
        Id: infoRow?._id || "",
        Code: infoRow?.code || "",
        Producto: infoRow?.product || "",
        Cantidad: infoRow?.quantity || "",
        Fecha: infoRow?.creado || "",
      },
    });

  const handleChangePage = async (event: any, newPage: number) => {
    // validar cuando se hace el Search para retonarlo con paginacion
    const entradas = await getEntradasForPageable(newPage * rowsPerPage);
    setEntrada(entradas);    
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = (modo?: any, info?: any) => {
    if (modo === "actualizacion") {
      setModal(true);

      setInfoRow(info);
    } else {
      setModal(true);

      setValor("");
      setValorCodigo("");
      setValorCantidad("");
      setValorFecha("");

    }
  };

  const createEntrada = async (data: any) => {
    try {
      const body: any = {
        code: data.code.label,
        product: data.product.label,
        quantity: data.quantity,
        creado: data.fecha,
      };      

      const response = await service.createEntrada(body);
      toast.success("Se creo correctamente la entrada", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setEntrada([...entrada, response]);
      setModal(false);
    } catch (error) {
      toast.error(JSON.stringify(error), {
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

  const updateEntrada = async (data: any) => {
    try {
      const id = infoRow._id;
      
      let body;
      
      if (data.code.label || data.product.label) {
        body = {
          code: data.code.label,
          product: data.product.label,
          quantity: data.quantity,
          creado: data.creado,
        };
      } else {
        body = {
          code: data.code,
          product: data.product,
          quantity: data.quantity,
          creado: data.creado,
        };
      }

      const response = await service.updateEntrada(body, id);
      setEntrada([...entrada, response]);

      const entradaInfo: any = await getEntradasForPageable();
      setEntrada(entradaInfo);
      setModal(false);

      toast.success("se actualizo correctamente la entrada!", {
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
      toast.error("No se creo actualizo la entrada!", {
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

  const deleteEntrada = async () => {
    try {
      const id = infoRow._id;

      const response = await service.deleteEntrada(id);
      const entradaInfo: any = await getEntradasForPageable();
      setEntrada(entradaInfo);
      setModal(false);

      toast.success("Se elimino correctamente la entrada!", {
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
      toast.error("No se elimino correctamente la entrada!", {
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

  const SearchForEntrada = async () => {
    if (busqueda.message === "") {
      const response: any = await getEntradasForPageable();
      setEntrada(response);
    } else {
      const response: any = await service.getSearchForEntrada(busqueda.message);
      setEntrada(response.content);
    }
    setBusqueda({ message: "" });
  };

  const handleOnKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      if (busqueda.message === "") {
        const response: any = await getEntradasForPageable();
        setEntrada(response);
        setBusqueda({ message: "" });
      } else {
        const response: any = await service.getSearchForEntrada(
          busqueda.message
        );
        setEntrada(response.content);
        setBusqueda({ message: "" });
      }
    }
  };

  const handleOnChange = (e: any) => {
    setBusqueda({ message: e.target.value });
  };

  const handleCloseModal = () => {
    setModal(false);
    setShowConfirm(false);
    setValor("");
    setValorCodigo("");
  };

  const getEntradasForPageable = async (offset?: number) => {
    const data: any = await service.getEntradaPaginations(
      0,
      offset ? offset : 0
    );

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const configInitial = async () => {
    const entradasInfo: any = await getEntradasForPageable();
    setEntrada(entradasInfo);

    let info: any = {};

    Object.keys(getValues())?.map((field) => {
      info[field] = {
        id: "outlined-basic",
        error: false,
        variant: "outlined",
        size: "small",
      };
    });

    let userPermission: any = localStorage.getItem("user");
    if (userPermission === "admin") {
      // setPermission(true);
    } else {
      // setPermission(false);
    }
  };

  useEffect(() => {
    configInitial();
  }, []);

  
  return (
    <>
      <Navbar handleCreate={ createEntrada }/>

      <Modales 
        tipo="entrada"
        control={control}
        register={register}
        kindModal="cambiar"
        openModal={modal}
        setValuesModal={setValue}
        handleOnClose={() => { setModal(false) }}
        handleUpdate={handleSubmit(updateEntrada)}
        handleDelete={handleSubmit(deleteEntrada)}
        handleOnInitValue={infoRow}
      />

      <Search
        placeholder="Entradas ..."
        handleOnChange={handleOnChange}
        handleOnKeyPress={handleOnKeyPress}
        valueSearch={busqueda.message}
        searchBy={SearchForEntrada}
      />

      {ShowConfirm && (
        <ConfirmModal
          show={true}
          message="Desea eliminar la entrada seleccionada?"
          onConfirm={deleteEntrada}
          onCancel={handleCloseModal}
        />
      )}

      <Tables 
        infoRow={entrada}
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
