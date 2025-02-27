import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  dbObjectId: null,
  login         : async () => {},
  signup        : async () => {},
  refreshToken  : async () => {},
  saveToken     : (dbObjectId, token) => {}, 
  logout        : async () => {},
});