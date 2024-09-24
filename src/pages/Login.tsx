import { useEffect, useState, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import { wavesMovement } from "../js/js";
import "../styles/Login.css";

import User from "../assets/usuario.png";
import LoginServices from "../services/LoginService";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const service = new LoginServices();

interface Auth {
  username: string;
  password: string;
}

export const Login = () => {
  const { register, handleSubmit } = useForm<Auth>();
  const [showPassword, setShowPassword] = useState(false);

  const { setLogin } = useContext(AppContext);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<Auth> = async (data) => {
    try {
      const token: any = await service.authentication(data);

      if (token.token) {
        setLogin(token.token);
        localStorage.setItem("token", token.token);
        localStorage.setItem("user", data?.username || "");

        navigate("/salida");

        toast("Ingreso Exitoso!", {
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Usuario o Password Incorrectas!", {
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

  useEffect(() => {}, []);

  return (
    <>
      <div className="font-behind">
        <form onSubmit={handleSubmit(onSubmit)} className="contenedor">
          <img src={User} alt="" />
          <h2>Inicio de Sesion</h2>
          <Box sx={{ display: "flex", alignItems: "flex-end", marginTop: 7 }}>
            <OutlinedInput
              style={{ margin: "0 auto", height: 35, width: 290 }}
              placeholder="Username"
              size="small"
              {...register("username")}
              
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              margin: 2,
              marginBottom: 10,
            }}
          >
            <OutlinedInput
              style={{ margin: "0 auto", height: 35 }}
              placeholder="Password"
              size="small"
              {...register("password")}
              id="filled-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
          <Button
            size="small"
            style={{
              width: 200,
              margin: "0 auto",
              position: "relative",
              bottom: 1,
              backgroundColor: "#25356D",
              textTransform: "capitalize",
              fontFamily: "cursive",
              fontSize: "20px",
            }}
            variant="contained"
            type="submit"
          >
            Ingresar
          </Button>
          <ToastContainer />
        </form>
      </div>
    </>
  );
};
