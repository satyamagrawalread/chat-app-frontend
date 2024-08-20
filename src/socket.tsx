import { io, Socket } from "socket.io-client";
import { URL } from "./constant";
import { getToken } from "./helpers";

interface ServerToClientEvents {
    welcome: (response: {user: string, text: string}) => void;
    serverMessage: (response: {id: number, message: string, userId: number, name: string, createdAt: string}) => void;
  }
  
  interface ClientToServerEvents {
    join: (session: {sessionId: number}) => void;
    clientMessage: (message: {userId: number, message: string, sessionId: number}) => void;
  }
  
  // interface InterServerEvents {
  //   ping: () => void;
  // }
  
  // interface SocketData {
  //   name: string;
  //   age: number;
  // }

const initSocket = async (backend_url: string) => {
    const options: { [key: string]: any } = {
        'force new connection': true,
        'reconnectionAttempt': 'Infinity',
        'timeout': 10000,
        'transports': ['websocket'],
          query: {
            token: getToken()
          }
    }

    return io(backend_url, options);
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = await initSocket(URL)
