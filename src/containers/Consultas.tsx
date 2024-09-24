import { Fade, Modal } from '@mui/material'
import { useState } from 'react'
import { IConsulta } from '../interfaces/Modal'
import { Search } from './Search'
import InventarioServices from '../services/InventarioServices';
import { Tables } from './Tables';
import EntradaServices from '../services/EntradaServices';

interface ColumnBusqueda {
    id: "code" | "product" | "precio" | "stock";
    label: string;
    minWidth?: number;
  }

const columns: ColumnBusqueda[] = [
    { id: "code", label: "Code", minWidth: 170 },
    { id: "product", label: "Producto", minWidth: 170 },
    { id: "precio", label: "Precio", minWidth: 170 },
    { id: "stock", label: "Stock", minWidth: 170 },
];

const service = new InventarioServices();

export const Consultas = ({
    openConsulta,
    handleOpenModal,
    onClose,
} : IConsulta) => {

    const [busqueda, setBusqueda] = useState({'message': ''});
    const [inventario, setInventario] = useState<any[]>([]);

    const [totalRegister, setTotalRegister] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [modal, setModal] = useState(false);
    const [skip, setSkip] = useState(0);
    const [page, setPage] = useState(0);

    const handleOnChange = (event: any) => {
        setBusqueda({ message: event.target.value });
    }

    const handleOnKeyPress = async (event : any) => {
        let response : any;

        if (event.key === 'Enter') {
            if (busqueda.message === '') {
                setInventario([]);
                setBusqueda({ message: '' });
                setTotalRegister(0);
            } else {
                response = await service.getSearchForInventario(
                    busqueda.message,
                    skip,
                    rowsPerPage
                );
                
                setInventario(response.content);
                setTotalRegister(response.total);
            }
        }
    }

    const searchForConsultas = async () => {
        let response : any;

        if (busqueda.message === '') {
            setInventario([]);
        } else {
            response = await service.getSearchForInventario(
                busqueda.message,
                skip,
                5
            );
            setInventario(response?.content);
            setTotalRegister(response?.total);
        }
    }

    /**
     * Funciones para <Tables />
     */
    const getInventarioForPageable = async (offset? : number) => {
        const data : any = await service.getSearchForInventario(
            0, offset ? offset : 0);
        
        if (data?.total != undefined) {
            setTotalRegister(data?.total);
        }
    }

    const handleChangePage = async (event : unknown, newPage : number) => {
        setSkip(newPage * rowsPerPage);
        const data : any = await service.getSearchForInventario(
            busqueda.message,
            newPage * rowsPerPage,
            rowsPerPage
        );
        setInventario(data?.content);
        setPage(newPage);        
    }

    const handleChangeRowsPerPage = (event : React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);        
    }

  return (
    <>
        <Modal 
            open={openConsulta}
            onClose={onClose}
            closeAfterTransition
        >
            <Fade in={openConsulta}>
                <div className="modal-busqueda form-modal">
                    <Search 
                        placeholder='Buscar ...'
                        handleOnChange={handleOnChange}
                        handleOnKeyPress={handleOnKeyPress}
                        valueSearch={busqueda.message}
                        searchBy={searchForConsultas}
                    />
                    <Tables
                        infoRow={inventario}
                        columnas={columns}
                        pagina={page}
                        totalRegistros={totalRegister}
                        filasPorPagina={rowsPerPage}
                        limitePorPagina={5}
                        handleChangePage={handleChangePage}
                        handleOpenModal={handleOpenModal}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>
            </Fade>
        </Modal>
    </>
  )
}
