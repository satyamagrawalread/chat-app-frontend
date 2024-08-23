
    
import { useState, ReactNode, FC, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { message } from "antd";
import { API, BEARER, URL } from "../constant";
import { useEffect } from "react";
import { getToken } from "../helpers";
// import { socket } from "../socket";
import { ServerToClientEvents, ClientToServerEvents, initSocket } from "../socket";
import { Socket } from "socket.io-client";


interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>();

  const authToken: string | null = getToken();

  const fetchLoggedInUser = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/users/me`, {
        headers: { Authorization: `${BEARER} ${token}` },
      });
      const data = await response.json();

      setUserData(data);
    } catch (error) {
      console.error(error);
      message.error("Error While Getting Logged In User Details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUser = (user: any) => {
    setUserData(user);
  };

  useEffect(() => {
    const init = async() => {
      
      if (authToken) {
        socket.current = await initSocket(URL);
        fetchLoggedInUser(authToken);
        socket.current.io.opts.query = {token: authToken};
      }
      else {
        setIsLoading(false);
      }
    }
    init();
    return () => {
      if (authToken) {
        socket.current?.close();
      }
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{ user: userData, setUser: handleUser, isLoading, socket: socket.current }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;