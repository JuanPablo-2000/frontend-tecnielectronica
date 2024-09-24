import { useNavigate } from "react-router-dom";

/** Material React UI */
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

import Paper from "@mui/material/Paper";

import { useEffect, useState } from "react";
import TiendaAudioService from "../services/TiendaAudioService";
import { Navbar } from "../containers/Navbar";
import { Modales } from "../containers/Modales";
import { useForm } from "react-hook-form";
import { IPrueba } from "./Inventario";
import { ToastContainer, toast } from "react-toastify";
import { Tables } from "../containers/Tables";

interface Column {
  id: "code" | "product" | "quantity" | "createdAt" | "stock";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: Column[] = [
  { id: "code", label: "Code", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 100 },
  { id: "quantity", label: "Stock", minWidth: 170 },
  { id: "createdAt", label: "Creado El", minWidth: 170 },
];

const service = new TiendaAudioService();

export const SalidaTiendaAudio = () => {
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
  const [salidaTiendaAudio, setSalidaTiendaAudio] = useState<any[]>([]);
  const [TiendaBusqueda, setTiendaBusqueda] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [totalRegisterSearch, setTotalRegisterSearch] = useState<number>(0);
  const [codeSelect, setCodeSelect] = useState<any[]>([]);
  const [saveProducto, setSaveProducto] = useState<any>();
  const [valor, setValor] = useState<any>();
  const [valorCodigo, setValorCodigo] = useState<any>();
  const [valorCantidad, setValorCantidad] = useState<any>();
  const [titulo, setTitulo] = useState<any>();

  const { register, control, handleSubmit, formState, getValues, setValue } =
    useForm<IPrueba>({
      defaultValues: {
        Id: infoRow?._id || "",
        Code: valorCodigo?.name || "",
        Producto: valor?.name || "",
        Cantidad: valorCantidad?.name || "",
        Fecha: infoRow?.creado || "",
        Actualizado: infoRow?.actualizado || "",
      },
    });

  const navigate = useNavigate();

  useEffect(() => {
    configInitial();
  }, []);

  const configInitial = async () => {
    const infoTienda: any = await getTiendaAudioForPageable();    
    setSalidaTiendaAudio(infoTienda);

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
  }

  const getTiendaAudioForPageable = async (offset?: number) => {
    const data: any = await service.getTiendaAudioPaginations(
      0,
      offset ? offset : 0
    );

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const handleChangePage = async (event: any, newPage: number) => {
    // validar cuando se hace el Search para retonarlo con paginacion
    const salidasTiendaAudio: any = await service.getTiendaAudioPaginations(
      0,
      newPage * rowsPerPage
    );

    setSalidaTiendaAudio(salidasTiendaAudio);
    setPage(newPage);
  };

  const handleChangePageSearch = async (event: unknown, newPage: number) => {
    setSkipSearch(newPage * rowsPerPageSearch);
    const data: any = await service.getSearchForTiendaAudio(
      consulta.message,
      newPage * rowsPerPageSearch,
      rowsPerPageSearch
    );
    setTiendaBusqueda(data?.content);
    setPageSearch(newPage);
  };

  const handleOpenModal = (modo?: string, info?: any) => {
    if (modo === "actualizacion") {
      setInfoRow(info);
      setModalModificar(true);
      setModalCreacion(false);
      setModal(true);

      setTitulo("Actualizar Registro");
    } else {
      setInfoRow(null);
      setModalModificar(false);
      setModalCreacion(true);
      setModal(true);

      setTitulo("Crear Registro");
    }
  };

  const handleChangeRowsPerPageSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPageSearch(+event.target.value);
    setPageSearch(0);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOnKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      if (busqueda.message === "") {
        const response: any = await service.getTiendaAudioPaginations(0, 0);
        setSalidaTiendaAudio(response);
        setPage(0);
      } else {
        const response: any = await service.getSearchForTiendaAudio(
          busqueda.message
        );
        setSalidaTiendaAudio(response.content);
        setTotalRegister(response.total);
        setPage(0);
      }
    }
  };

  const createSalidaTiendaAudio = async (data: any) => {
    try {
      let body = {
        code: data.code.label,
        product: data.product.label,
        quantity: Number(data.quantity),
        creado: data.created,
        actualizado: data.updated,
      };

      const response = await service.createTiendaAudio(body);

      toast.success("Se creo correctamente el registro!", {
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
      toast.error(error + ""),
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        };
    }
  };

  const updateSalidaTiendaAudio = async (data: any) => {
    try {
      const id = infoRow._id;

      const body = {
        code: data.code,
        product: data.product,
        quantity: data.quantity,
        creado: data.created,
        actualizado: data.updated,
      };

      const response = await service.updateTiendaAudio(body, id);

      toast.success("Se modifico correctamente el registro", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setSalidaTiendaAudio([...salidaTiendaAudio, response]);
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

  const deleteSalidaTiendaAudio = async (data: any) => {
    try {
      const id = infoRow._id;

      const response = await service.deleteTiendaAudio(id);

      toast.success("Se elimino correctamente el registro", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setSalidaTiendaAudio([...salidaTiendaAudio, response]);
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

  const SearchConsultaInventario = async () => {
    if (consulta.message === "") {
      setTiendaBusqueda([]);
    } else {
      const response: any = await service.getSearchForTiendaAudio(
        consulta.message,
        skipSearch,
        5
      );
      setTotalRegisterSearch(response.total);
      setTiendaBusqueda(response.content);
      // setConsulta({ message: "" });
    }
  };

  const handleOnKeyPressBusqueda = async (e: any) => {
    if (e.key === "Enter") {
      if (consulta.message === "") {
        setTiendaBusqueda([]);
        setTotalRegisterSearch(0);
      } else {
        const response: any = await service.getSearchForTiendaAudio(
          consulta.message,
          skipSearch,
          5
        );
        setTotalRegisterSearch(response.total);
        setTiendaBusqueda(response.content);
      }
    }
  };

  const SearchForInventario = async () => {
    if (busqueda.message === "") {
      const response: any = await service.getTiendaAudioPaginations(0, 0);
      setSalidaTiendaAudio(response);
      setPage(0);
    } else {
      const response: any = await service.getSearchForTiendaAudio(
        busqueda.message
      );
      setSalidaTiendaAudio(response.content);
      setTotalRegister(response.total);
    }
  };

  const handleonChangeBusqueda = (e: any) => {
    setConsulta({
      message: e.target.value,
    });
  };

  const handleOnChange = (e: any) => {
    setBusqueda({
      message: e.target.value,
    });
  };

  return (
    <>
      <Navbar handleCreate={createSalidaTiendaAudio} />

      <Modales
        tipo="salida-tienda-audio"
        control={control}
        register={register}
        kindModal="cambiar"
        openModal={modal}
        setValuesModal={setValue}
        handleOnClose={() => {
          setModal(false);
        }}
        handleOnInitValue={infoRow}
        handleUpdate={handleSubmit(updateSalidaTiendaAudio)}
        handleDelete={handleSubmit(deleteSalidaTiendaAudio)}
      />

      <div className="flex-title">
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            position: "relative",
            width: 400,
            height: 40,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Salidas Tienda de Audio..."
            onChange={handleOnChange}
            onKeyDown={handleOnKeyPress}
            value={busqueda.message}
          />
          <IconButton
            type="button"
            sx={{ p: "20px", left: 10 }}
            aria-label="search"
            onClick={SearchForInventario}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      <Tables
        infoRow={salidaTiendaAudio}
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
