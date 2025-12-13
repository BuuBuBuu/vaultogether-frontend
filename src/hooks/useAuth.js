import { useState, useEffect, useContext } from "react";
import { registerUser, loginUser } from "../services/api";
import { AuthContext } from "../store/AuthContext";

function useAuth() {

  // Use the context that we had created inside AuthContext
  // When create we use createContext in the other file
  // Here just to use we just need use useContext can
  return useContext(AuthContext);
}

export default useAuth;
