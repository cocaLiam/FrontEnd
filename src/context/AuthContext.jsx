import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  dbObjectId: null,
  login         : () => {},
  signup        : () => {},
  refreshToken  : () => {},
  logout        : () => {},
});