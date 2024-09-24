import { useRef } from "react";
import moment from "moment";

import Paper from "@mui/material/Paper";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  TableCell,
} from "@mui/material";
import { ITable } from "../interfaces/Modal";

export const Tables = ({
  infoRow,
  columnas,
  pagina,
  totalRegistros,
  filasPorPagina,
  limitePorPagina,
  handleChangePage,
  handleOpenModal,
  handleChangeRowsPerPage,
}: ITable) => {
  return (
    <>
      <Paper
        sx={{
          width: "80%",
          margin: "0 auto",
          position: "relative",
          top: 20,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columnas.map((columna : any) => (
                <TableCell
                  key={columna.id}
                  align={"center"}
                  style={{
                    minWidth: 100,
                    background: "#0036FF",
                    color: "#fff",
                    margin: "0 auto",
                    fontSize: 20,
                    fontWeight: "600",
                    fontFamily: "cursive",
                  }}
                >
                  {columna.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {infoRow?.map((row : any, index : any) => {
              return (
                <TableRow 
                hover
                role="checkbox"
                key={index}
                onClick={() => handleOpenModal('actualizacion', row)}
                >
                  {columnas.map((columna : any) => {
                    if(columna.id == "fecha" || columna.id == "creado" || columna.id == "createdAt") {
                      return (
                        <TableCell
                          key={columna.id}
                          align="center"
                          style={{  
                            fontSize: 14,
                            fontWeight: "bold",
                            fontFamily: "cursive",
                          }}
                        >
                          
                          {moment(new Date(row[columna.id])).format("MM/DD/yyyy hh:mm a")}
                        </TableCell>
                      );
                    }

                    if(columna.id == "nota") {
                      return (
                        <TableCell
                          key={columna.id}
                          align={"center"}
                          style={{
                            overflow: "auto",
                            maxHeight: "100px",
                            wordBreak: "break-all",
                            height: "80px",
                            display: "block",
                            maxWidth: "160px",
                            fontSize: 14,
                            fontWeight: "bold",
                            fontFamily: "cursive",
                          }}
                        >
                          {row[columna.id]}
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell
                        key={columna.id}
                        align="center"
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          fontFamily: "cursive",
                        }}
                      >
                        {row[columna.id]}
                      </TableCell>
                    )

                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5]}
          defaultValue=""
          component="div"
          count={totalRegistros}
          rowsPerPage={filasPorPagina}
          page={pagina}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};
