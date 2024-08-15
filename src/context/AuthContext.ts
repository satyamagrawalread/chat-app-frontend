import { createContext, useContext } from "react";

interface AuthContextType {
    user: any;
    isLoading: boolean;
    setUser: (user: any) => void;
}
export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isLoading: false,
  setUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);