import { socket } from "../socket";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";
import { cn } from "../utils/cn";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import { Session } from "../types/session.types";
import ChatSession from "./chat/ChatSession";
import { useGetAllSessionsForUser } from "../hooks/api-hooks/useSessionQuery";


const Chats = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionsQuery = useGetAllSessionsForUser()
  const sessionId = searchParams.get("sessionId");


  function handleErrors(e: any) {
    console.log("Socket error", e);
    message.error({
      content: "Socket connection failed. Server is Starting, try again.",
      duration: 3000,
    });
  }
  const onSessionSelection = (session: Session) => {
    if (session.id) {
      searchParams.set("sessionId", `${session.id}`);
      setSearchParams(searchParams);
    }
    socket.emit("join", {
      sessionId: session.id,
    });
  };
  const items: MenuProps["items"] =
    sessionsQuery.data &&
    sessionsQuery.data["sessions"] &&
    sessionsQuery.data["sessions"].map((session: Session, index: number) => {
      return {
        key: index.toString,
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
      };
    });

  return (
    <div>
      <div className="flex overflow-hidden">
        <div className="md:w-1/4 bg-white border-r border-gray-300 w-0 ">
          <header className="px-4 pt-2 border-gray-300 flex justify-between items-center  text-white md:hidden absolute right-1">
            <div className="relative ">
              <Dropdown menu={{ items }} placement="bottomLeft">
                <Button>
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
                </Button>
              </Dropdown>
              <div
                id="menuDropdown"
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg hidden"
              >
                <ul className="py-2 px-3 max-h-60 overflow-y-scroll flex flex-col gap-2">
                  {sessionsQuery.data &&
                    sessionsQuery.data["sessions"] &&
                    sessionsQuery.data["sessions"].map((session: Session) => (
                      <div
                        key={session.id}
                        onClick={() => onSessionSelection(session)}
                        className={cn(
                          "flex text-black items-center cursor-pointer hover:bg-neutral-200 p-2 rounded",
                          Number(sessionId || -1) === session.id &&
                            "bg-neutral-200"
                        )}
                      >
                        <div className={cn("flex-1")}>
                          <h2 className="text-sm font-semibold">
                            {session.name}
                          </h2>
                          <p className="text-gray-600 text-xs">
                            {session.lastMessage}
                          </p>
                        </div>
                      </div>
                    ))}
                </ul>
              </div>
            </div>
          </header>

          <div className="overflow-y-auto h-screen p-3 mb-9 pb-20 hidden md:flex flex-col gap-1 ">
            {sessionsQuery.isLoading && <p>Loading Sessions...</p>}
            {sessionsQuery.data &&
              sessionsQuery.data["sessions"] &&
              sessionsQuery.data["sessions"].map((session: Session) => (
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
                    <p className="text-gray-600 text-sm">
                      {session.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <ChatSession sessionId={sessionId || ""} />
      </div>
    </div>
  );
};

export default Chats;
