import { createContext, useContext } from "react";
import { ServerToClientEvents, ClientToServerEvents } from "../socket";
import { Socket } from "socket.io-client";

interface AuthContextType {
    user: any;
    isLoading: boolean;
    setUser: (user: any) => void;
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined
}
export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isLoading: false,
  setUser: () => {},
  socket: undefined
});

export const useAuthContext = () => useContext(AuthContext);