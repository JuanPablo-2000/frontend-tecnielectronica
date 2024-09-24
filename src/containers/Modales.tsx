import { useEffect, useState } from "react";

import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";

import "../styles/Inventario.css";

import {
  Backdrop,
  Modal,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { IFields, IModal } from "../interfaces/Modal";
import InventarioServices from "../services/InventarioServices";
import { useLocation } from "react-router-dom";
import moment from "moment";

const service = new InventarioServices();

export const Modales = ({
  tipo,
  control,
  register,
  kindModal,
  openModal,
  setValuesModal,
  handleOnClose,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleOnInitValue,
}: IModal) => {
  const [data, setData] = useState<any[]>();
  const [fields, setFields] = useState<IFields[]>();

  useEffect(() => {
    if (openModal) {
      initialConfig();
    }
  }, [openModal]);

  const initialConfig = () => {
    if (tipo === "salida" || tipo === "entrada") {
      fillDataSelect();

      setFields([
        {
          name: "code",
          label: "Codigos",
          required: true,
          type: "autocomplete",
        },
        {
          name: "product",
          label: "Productos",
          required: true,
          type: "autocomplete",
        },
        { name: "quantity", label: "Cantidad", required: true, type: "number" },
        { name: "creado", label: "Fecha", required: true, type: "date" },
      ]);
    }
    if (tipo === "inventario") {
      fillDataSelect();
      setFields([
        {
          name: "code",
          label: "Codigos",
          required: true,
          type: "autocomplete",
        },
        {
          name: "product",
          label: "Productos",
          required: true,
          type: "autocomplete",
        },
        { name: "precio", label: "Precio", required: false, type: "number" },
        { name: "stock", label: "Stock", required: false, type: "number" },
        { name: "nota", label: "Notas", required: false, type: "text" },
        { name: "salida", label: "Salida", required: false, type: "number" },
        { name: "fecha", label: "", required: true, type: "date" },
      ]);
    }
    if (tipo === "salida-tienda-audio") {
      fillDataSelect();
      setFields([
        {
          name: "code",
          label: "Codigos",
          required: true,
          type: "autocomplete",
        },
        {
          name: "product",
          label: "Productos",
          required: true,
          type: "autocomplete",
        },
        { name: "quantity", label: "Cantidad", required: true, type: "number" },
      ]);
    }
    if (handleOnInitValue) {
      Object.keys(handleOnInitValue).map((tmp) => {
        setValuesModal(tmp, handleOnInitValue[tmp]);
      });
    }
  };

  const codition = (condition: boolean, field: IFields) => {
    if (condition) {
    } else {
    }
  };

  const renderSelects = (
    field: ControllerRenderProps<FieldValues, string>,
    campos: string
  ) => {
    if (field.name === "code") {
      const info =
        data?.map((tmp: any) => ({ label: tmp.code, id: tmp._id })) || [];

      return (
        <Autocomplete
          options={info}
          size="small"
          {...field}
          onChange={(eve, value) => {
            field.onChange(value);
          }}
          isOptionEqualToValue={(option, value) => option.id === option.id}
          renderInput={(params) => (
            <TextField {...params} {...field} label={campos} />
          )}
          className="size-textfield"
        />
      );
    }

    if (field.name === "product") {
      const info =
        data?.map((tmp: any) => ({ label: tmp.product, id: tmp._id })) || [];
      return (
        <Autocomplete
          options={info}
          size="small"
          {...field}
          onChange={(eve, value) => {
            field.onChange(value);
          }}
          isOptionEqualToValue={(option, value) => option.id === option.id}
          renderInput={(params) => <TextField {...params} label={campos} />}
          className="size-textfield"
        />
      );
    }

    return <></>;
  };

  const fillDataSelect = async () => {
    const data: any = await service.getAllInventario();
    setData(data);
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleOnClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <form>
          <div className="center-fields">
            {kindModal === "crear" && <h4>Creación</h4>}

            {kindModal === "cambiar" && <h4>Actualización</h4>}

            {fields?.map((field, index) => {
              if (kindModal == 'crear' && tipo == 'inventario') {
                return (
                  <div key={index}>
                      {(field.type === "number" || field.type === "text") && (
                        <Controller
                          name={field.name}
                          rules={{ required: field.required }}
                          {...register(field.name)}
                          control={control}
                          render={({ field: field1 }) => {
                            return (
                              <TextField
                                {...field1}
                                {...register(field.name)}
                                type={field.type}
                                size="small"
                                label={field.label}
                                variant="outlined"
                                id="outlined-basic"
                                className="size-textfield"
                              />
                            );
                          }}
                        />
                      )}
    
                      {field.type === "autocomplete" && (
                        <Controller
                        name={field.name}
                        rules={{ required: field.required }}
                        {...register(field.name)}
                        control={control}
                        render={({ field: field1 }) => {
                          return (
                            <TextField
                              {...field1}
                              {...register(field.name)}
                              type={field.type}
                              size="small"
                              label={field.label}
                              variant="outlined"
                              id="outlined-basic"
                              className="size-textfield"
                            />
                          );
                        }}
                      />
                      )}
    
                      {field.type === "date" && (
                        <Controller
                          name={field.name}
                          rules={{ required: field.required }}
                          control={control}
                          render={({ field: field1 }) => {
                            return (
                              <TextField
                                size="small"
                                {...field1}
                                value={moment(new Date(field1.value)).format(
                                  "yyyy-MM-DD"
                                )}
                                onChange={(value) => {
                                  field1.onChange(value);
                                }}
                                type={field.type}
                                label={field.label}
                                variant="outlined"
                                id="outlined-basic"
                                className="size-textfield"
                              />
                            );
                          }}
                        />
                      )}
                    </div>
                )
              } else {
                return (
                  <div key={index}>
                    {(field.type === "number" || field.type === "text") && (
                      <Controller
                        name={field.name}
                        rules={{ required: field.required }}
                        {...register(field.name)}
                        control={control}
                        render={({ field: field1 }) => {
                          return (
                            <TextField
                              {...field1}
                              {...register(field.name)}
                              type={field.type}
                              size="small"
                              label={field.label}
                              variant="outlined"
                              id="outlined-basic"
                              className="size-textfield"
                            />
                          );
                        }}
                      />
                    )}
  
                    {field.type === "autocomplete" && (
                      <Controller
                        name={field.name}
                        rules={{ required: field.required }}
                        control={control}
                        {...register(field.name)}
                        render={({ field: field1 }) => {
                          return renderSelects(field1, field.label);
                        }}
                      />
                    )}
  
                    {field.type === "date" && (
                      <Controller
                        name={field.name}
                        rules={{ required: field.required }}
                        control={control}
                        render={({ field: field1 }) => {
                          return (
                            <TextField
                              size="small"
                              {...field1}
                              value={moment(new Date(field1.value)).format(
                                "yyyy-MM-DD"
                              )}
                              onChange={(value) => {
                                field1.onChange(value);
                              }}
                              type={field.type}
                              label={field.label}
                              variant="outlined"
                              id="outlined-basic"
                              className="size-textfield"
                            />
                          );
                        }}
                      />
                    )}
                  </div>
                );
              }
            })}
          </div>

          {kindModal === "crear" && (
            <div className="button-modal">
              <Button
                type="submit"
                variant="contained"
                className="button-modal"
                onClick={handleCreate}
                style={{ background: "#0036FF" }}
              >
                Crear
              </Button>
            </div>
          )}

          {kindModal === "cambiar" && (
            <div className="button-modal">
              <Button
                type="submit"
                variant="contained"
                onClick={handleUpdate}
                style={{ background: "#0036FF" }}
              >
                Cambiar
              </Button>
              <Button
                variant="contained"
                onClick={handleDelete}
                style={{ background: "#0036FF" }}
              >
                Eliminar
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
};
