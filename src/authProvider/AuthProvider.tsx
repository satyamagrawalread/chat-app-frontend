
    
import React, { useState, ReactNode, FC } from "react";
import { AuthContext } from "../context/AuthContext";
import { message } from "antd";
import { API, BEARER } from "../constant";
import { useEffect } from "react";
import { getToken } from "../helpers";
import { socket } from "../socket";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);


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
    if (authToken) {
      fetchLoggedInUser(authToken);
      socket.io.opts.query = {token: authToken};
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{ user: userData, setUser: handleUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;