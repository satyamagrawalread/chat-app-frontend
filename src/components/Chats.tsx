// import { socket } from "../socket";
import { Skeleton } from "antd";
import { useSearchParams } from "react-router-dom";
import { cn } from "../utils/cn";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import { FaChevronDown } from "react-icons/fa";
import { Session } from "../types/session.types";
import ChatSession from "./chat/ChatSession";
import { useGetAllSessionsForUser } from "../hooks/api-hooks/useSessionQuery";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { message } from "antd";

const Chats = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionsQuery = useGetAllSessionsForUser();
  const sessionId = searchParams.get("sessionId");
  const { user, socket } = useAuthContext();
  const [selectedSessionName, setSelectedSessionName] = useState<string>('Select Session');
  useEffect(() => {
    socket?.connect();
    socket?.on("connect", () => {
      if (socket.recovered) {
        message.success("Server Recovered");
      }
    });
    socket?.on("connect_error", (error) => {
      if (socket.active) {
        message.warning("Server temporary failure");
      } else {
        console.log(error);
        message.error(error?.message);
      }
    });
    return () => {
      socket?.disconnect();
      // socket?.on("disconnect", () => {
      //   // message.error('Server disconnected')
      // });
    };
  }, [user]);

  useEffect(() => {
    if(!sessionId) {
      setSelectedSessionName('Select Session');
    }
    sessionsQuery.data?.sessions && sessionsQuery.data.sessions?.length > 0 && sessionsQuery.data.sessions.some((session) => {
      if (session.id === Number(sessionId)) {
        setSelectedSessionName(session.name);
        return true;
      }
    })
  }, [sessionId, sessionsQuery])

  // function handleErrors(e: any) {
  //   console.log("Socket error", e);
  //   message.error({
  //     content: "Socket connection failed. Server is Starting, try again.",
  //     duration: 3000,
  //   });
  // }
  const onSessionSelection = (session: Session) => {
    if (Number(sessionId) === session.id) return;
    if (session.id) {
      console.log(session);
      searchParams.set("sessionId", `${session.id}`);
      setSearchParams(searchParams);
    }
    socket?.emit("join", {
      sessionId: session.id,
    });
  };
  const items: MenuProps["items"] =
    sessionsQuery.data && sessionsQuery.data?.sessions?.length == 0
      ? [
          {
            key: 1,
            label: <div>No session created</div>,
          },
        ]
      : sessionsQuery.data?.sessions?.map(
          (session: Session, index: number) => ({
            key: index,
            label: (
              <div
                key={session.id}
                onClick={() => onSessionSelection(session)}
                className={cn(
                  "w-64 flex text-black items-center cursor-pointer hover:bg-neutral-200 p-2 rounded",
                  Number(sessionId || -1) === session.id && "bg-neutral-200"
                )}
              >
                <div className={cn("flex-1")}>
                  <h2 className="text-sm font-semibold">{session.name}</h2>
                  <p className="text-gray-600 text-xs">{session.lastMessage}</p>
                </div>
              </div>
            ),
          })
        );

  return (
    <div className="w-screen flex flex-1 overflow-y-auto">
      <header className="px-4 pt-2 border-gray-300 flex justify-between items-center  text-white  md:hidden absolute right-1">
        <div className="relative ">
          <Dropdown menu={{ items }} placement="bottomLeft">
            {/* <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 30 30"
              >
                <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
              </svg>
            </Button> */}
            <Button className="text-blue-600">{selectedSessionName} <FaChevronDown /></Button>
          </Dropdown>
        </div>
      </header>
      <div className="md:min-w-64 md:block bg-white border-r border-gray-300 hidden overflow-y-auto">
        <div className="overflow-y-auto p-3 md:flex flex-col gap-1 ">
          {sessionsQuery.isLoading ? (
            <Skeleton />
          ) : (
            sessionsQuery.data?.sessions &&
            sessionsQuery.data.sessions?.length > 0 ?
            sessionsQuery.data?.sessions.map((session: Session) => (
              <div
                key={session.id}
                onClick={() => onSessionSelection(session)}
                className={cn(
                  "flex text-black items-center cursor-pointer hover:bg-neutral-100 p-2 rounded",
                  Number(sessionId || -1) === session.id &&
                    "bg-neutral-200 hover:bg-neutral-200"
                )}
              >
                <div className={cn("flex-1")}>
                  <h2 className="text-base font-semibold">{session.name}</h2>
                  <p className="text-gray-600 text-sm">{session.lastMessage}</p>
                </div>
              </div>
            )) : <div>No Session created</div>
          )}
        </div>
      </div>
      <ChatSession sessionId={sessionId || ""} />
    </div>
  );
};

export default Chats;
