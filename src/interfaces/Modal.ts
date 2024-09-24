import { ReactNode } from "react";
import { Control, FieldValues, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { IPrueba } from "../pages/Inventario";

export interface IFields {
  name: string;
  label: string;
  required: boolean;
  type: string;
}

export interface IModal {
    tipo: string;
    control: Control<IPrueba>;
    register: any;
    kindModal: string;
    openModal: boolean;
    setValuesModal?: any;
    handleOnClose?: () => void;
    handleOnInitValue?: any;
    handleCreate?: (event: any) => void;
    handleUpdate?: () => void;
    handleDelete?: () => void;
}

export interface INavbar {
  handleCreate: (event?: any) => void;
}

export interface ITable {
  infoRow: any;
  columnas: any;
  pagina: number;
  totalRegistros: number;
  filasPorPagina: number;
  limitePorPagina?: number;
  handleChangePage: (event : unknown, newPage : number) => Promise<any>;
  handleOpenModal: (modo? : string, info? : any) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ISearch {
  placeholder: string;
  handleOnChange: (event : any) => void;
  handleOnKeyPress: (event : any) => Promise<void>;
  valueSearch: any;
  searchBy: () => Promise<void>;
}

export interface IConsulta {
  handleOpenModal: (modo? : string, info? : any) => void;
  openConsulta: boolean;
  onClose: () => void;

}