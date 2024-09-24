import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const useRenderForms = (initial?: any) => {
  const [fields, setFields] = useState<any[]>([]);
  const { register, control, handleSubmit, formState, getValues, setValue } = 
  useForm({
    defaultValues: {
        ...(initial || {}) 
    }});

  useEffect(() => {}, []);

  const initialSettings = () => {
    try {
      // Validar la url actual (vista)
      const view = "inventario" || "salida" || "entrada";

      switch (view) {
        // case "inventario": {
        //   buildFieldsForInventory();
        //   break;
        // }
        // case "salida": {
        //     break;
        // }
        // case "entrada": {
        //     break
        // }
      }
    } catch (error) {
        console.log(error);
    }
  };

  const buildFieldsForInventory = () => {
    const url = 'autocomplete' || '';
    const renderFields = [];
    renderFields.push(
    <Controller 
        name={''}
        rules={{ required: false }}
        control={control}
        render={({ field }) => {
            if (url === 'autocomplete') {
                return (
                    <Autocomplete 
                        renderInput={(params) => { return <TextField />; }} 
                        options={[]}/>
                )
                } else {
                return (    
                    <TextField />
                )
            }
        }}
    />,
    {
        register: {...register("Producto")}, 
        id: "outlined-basic", 
        variant: "outlined",
        label: "Producto", 
        size: "small", 
    }, 
        {}
    );
    const format = buildFieldsDynamic(renderFields);
    setFields(renderFields);
  };

  const buildFieldsDynamic = (data:any[]) => {
    data.map((tmp) => {
        switch(tmp.type) {
            case "text": {
                break;
            }
        }
    })

    return data;
  }
  return [fields, setFields];
};
