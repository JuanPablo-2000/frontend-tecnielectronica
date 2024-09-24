import { useState, createContext } from 'react';
import LoginServices from '../services/LoginService';
import UserServices from '../services/UserServices';
import RoleServices from '../services/RoleServices';

export const AuthenticationContext = createContext<any>(null);

const authService = new LoginServices();
const userService = new UserServices();
const roleService = new RoleServices();

interface authResponse {
    username: string,
    role: string
}

export const AuthProvider : any = ({children}: any) => {

    const [user, setUser] = useState<any>();

    const logIn = async (data: any) => {
        const getLoggin: any = await authService.authentication(data);
        const getUser: any = await userService.getUserByUsername(getLoggin.username);
        const getRol: any = await roleService.getRolById(getUser.roles[0]);

        const userLogged : authResponse = {
            username: getUser.username,
            role: getRol.name
        }

        setUser(userLogged);
    }

    const logOut = () => setUser(null)

    const isLogged = () => !!user;

    const hasRole = (role: any) => user?.role === role;

    const contextValue = {
        user,
        isLogged,
        hasRole,
        logIn,
        logOut
    }

    return (
        <AuthenticationContext.Provider value={contextValue}> {children} </AuthenticationContext.Provider>
    );
}