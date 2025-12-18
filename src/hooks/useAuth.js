import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";

function useAuth() {

  // Use the context that we had created inside AuthContext
  // When create we use createContext in the other file
  // Here just to use we just need use useContext can
  return useContext(AuthContext);
}

export default useAuth;
