import { createContext } from "react";

//permet d'avoir une authentification en partant de zéro
export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    token: null,
    account: null,
    login: () => {},
    logout: () => {},
});