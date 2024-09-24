import { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/Inventario.css";

import moment from "moment";

import SalidaServices from "../services/SalidaServices";
import { useForm, Controller } from "react-hook-form";
import InventarioServices from "../services/InventarioServices";
import { ConfirmModal } from "./ConfirmModal";
import { Codigo, Producto } from "../interfaces/Selects";
import { Navbar } from "../containers/Navbar";
import { Modales } from "../containers/Modales";
import { IPrueba } from "./Inventario";
import { Search } from "../containers/Search";
import { Tables } from "../containers/Tables";

interface Column {
  id: "code" | "product" | "quantity" | "creado";
  label: string;
  minWidth?: number;
}

const columns: Column[] = [
  { id: "code", label: "Codigo", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 170 },
  { id: "quantity", label: "Cantidad", minWidth: 170 },
  { id: "creado", label: "Dia venta", minWidth: 170 },
];

const service = new SalidaServices();
const serviceInventario = new InventarioServices();

export const Salida = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);

  const [busqueda, setBusqueda] = useState({ message: "" });
  const [salida, setSalida] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [valorCodigo, setValorCodigo] = useState<any>();
  const [valor, setValor] = useState<any>();
  const [valorCantidad, setValorCantidad] = useState<any>();
  const [valorFecha, setValorFecha] = useState<any>();

  const { register, control, handleSubmit, formState, getValues, setValue } =
    useForm<IPrueba>({
      defaultValues: {
        Id: infoRow?._id || "",
        Code: valorCodigo?.name || "",
        Producto: valor?.name || "",
        Cantidad: valorCantidad?.name || "",
        Fecha: infoRow?.creado || "",
      },
    });

  const handleChangePage = async (event: unknown, newPage: number) => {
    const salidas = await getInventarioForPageable(newPage * rowsPerPage);
    setSalida(salidas);
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

      setValor({ name: info.product });
      setValorCodigo({ name: info.code });
      setValorCantidad(info.quantity);
      setValorFecha(moment(info.creado).format("yyyy-MM-DD"));

      setInfoRow(info);
    } else {
      if (modo === "creacionConsulta") {
        setInfoRow(null);
        setModal(true);

        setValor({ name: info.product });
        setValorCodigo({ name: info.code });
        setValorCantidad("");
        setValorFecha("");
      } else {
        setModal(true);

        setValor("");
        setValorCodigo("");
        setValorCantidad("");
        setValorFecha("");
      }
    }
  };

  const createSalida = async (data: any) => {
    try {
      const body: any = {
        code: data.code.label,
        product: data.product.label,
        quantity: data.quantity,
        creado: data.creado,
      };

      console.log(body);

      const response = await service.createSalida(body);

      setSalida([...salida, response]);
      setModal(false);

      toast.success("Se creo correctamente la venta!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setSalida([...salida, response]);
      setModal(false);
    } catch (error) {
      toast.error("No se creo correctamente la venta!", {
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

  const updateSalida = async (data: any) => {
    try {
      const id = infoRow._id;

      let body;

      if (data.code.label && data.product.label) {
        body = {
          code: data.code.label,
          product: data.product.label,
          quantity: data.quantity,
          creado: data.creado,
        };
      } else if (data.code.label) {
        body = {
          code: data.code.label,
          product: data.product,
          quantity: data.quantity,
          creado: data.creado,
        };
      } else if (data.product.label) {
        body = {
          code: data.code,
          product: data.product.label,
          quantity: data.quantity,
          creado: data.creado,
        };
      } else {
        body = {
          code: data.code,
          product: data.product.label,
          quantity: data.quantity,
          creado: data.creado,
        };
      }

      const response = await service.updateSalida(body, id);
      setSalida([...salida, response]);

      const salidaInfo: any = await getInventarioForPageable();
      setSalida(salidaInfo);
      setModal(false);

      toast.success("Se actualizo correctamente la venta!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      toast.error(error, {
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

  const deleteSalida = async () => {
    try {
      const id = infoRow._id;

      const response = await service.deleteSalida(id);
      const salidaInfo: any = await getInventarioForPageable();
      setSalida(salidaInfo);
      setModal(false);

      toast.success("Se elimino correctamente la salida!", {
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
      toast.error("No se actualizo correctamente la salida!", {
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

  const SearchForSalidas = async () => {
    if (busqueda.message === "") {
      const response: any = await getInventarioForPageable();
      setSalida(response);
    } else {
      const response: any = await service.getSearchForSalida(busqueda.message);

      setSalida(response.cotent);
    }
    setBusqueda({ message: "" });
  };

  const handleOnKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      if (busqueda.message === "") {
        const response: any = await getInventarioForPageable();
        setSalida(response);
        setBusqueda({ message: "" });
      } else {
        const response: any = await service.getSearchForSalida(
          busqueda.message
        );
        setSalida(response.cotent);
        setBusqueda({ message: "" });
      }
    }
  };

  const handleOnChange = (e: any) => {
    setBusqueda({
      message: e.target.value,
    });
  };

  const handleCloseModal = () => {
    setModal(false);
    setShowConfirm(false);
    setValor("");
    setValorCodigo("");
  };

  const configInitial = async () => {
    const inventarioInfo: any = await getInventarioForPageable();
    setSalida(inventarioInfo);

    let info: any = {};

    Object.keys(getValues())?.map((field) => {
      info[field] = {
        id: "outlined-basic",
        error: false,
        variant: "outlined",
        size: "small",
      };
    });
  };

  const getInventarioForPageable = async (offset?: number) => {
    const data: any = await service.getSalidaPaginations(
      0,
      offset ? offset : 0
    );

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const fillDataSelect = async () => {
    const infoInventario: any = await serviceInventario.getAllInventario();

    const dataProduct: Producto[] = [];
    const dataCode: Codigo[] = [];

    infoInventario.map((info: any) => {
      dataProduct.push({ name: info.product });
      dataCode.push({ name: info.code });
    });
  };

  useEffect(() => {
    configInitial();
    fillDataSelect();
  }, []);

  return (
    <>
      <Navbar handleCreate={createSalida} />

      <Modales
        tipo="salida"
        control={control}
        register={register}
        kindModal="cambiar"
        openModal={modal}
        setValuesModal={setValue}
        handleOnClose={() => {
          setModal(false);
        }}
        handleOnInitValue={infoRow}
        handleCreate={handleSubmit(createSalida)}
        handleUpdate={handleSubmit(updateSalida)}
        handleDelete={handleSubmit(deleteSalida)}
      />

      <Search
        placeholder="Ventas ..."
        handleOnChange={handleOnChange}
        handleOnKeyPress={handleOnKeyPress}
        valueSearch={busqueda.message}
        searchBy={SearchForSalidas}
      />

      {ShowConfirm && (
        <ConfirmModal
          show={true}
          message="Desea eliminar la Venta Seleccionada?"
          onConfirm={deleteSalida}
          onCancel={handleCloseModal}
        />
      )}

      <Tables
        infoRow={salida}
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
