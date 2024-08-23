import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useGetSessionDetailsById } from "../../hooks/api-hooks/useSessionQuery";
import { useGetMessagesBySessionId } from "../../hooks/api-hooks/useMessageQuery";
import { Message } from "../../types/message.types";
// import { socket } from "../../socket";
import Messages from "./Message";
import { Skeleton } from 'antd';
import { cn } from "../../utils/cn";
import { useQueryClient } from "@tanstack/react-query";


const ChatSession = ({ sessionId }: { sessionId: string }) => {
  const [sendText, setSendText] = useState<string>("");
  const [ sendTextRows, setSendTextRows ] = useState<number>(1);
  const { user, socket } = useAuthContext();
  const { data: sessionData, isLoading } = useGetSessionDetailsById({
    sessionId: sessionId || "",
  });

  const { data: messagesData, isLoading: isMessagesDataLoading } =
    useGetMessagesBySessionId({
      sessionId: Number(sessionId || ""),
    });

  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    setNewMessages([]);
  }, [sessionId]);

  useEffect(() => {
    
    const handler = ({
      id,
      message,
      userId,
      createdAt,
    }: {
      id: number;
      message: string;
      userId: number;
      createdAt: string;
    }) => {
      if (message.trim()) {
        const newMessage: Message = {
          id: id,
          text: message,
          sender: {
            id: userId,
          },
          receiver: {
            id: user.id,
          },
          time: createdAt,
        };
        setNewMessages((prev) => [newMessage, ...prev]);
        queryClient.setQueryData(["sessions"], (oldData: any) => {
          if(!oldData) return oldData;
          return {
            ...oldData,
            sessions: oldData.sessions.map((session: any) => {
              if (session.id === Number(sessionId)) {
                return {
                  ...session,
                  lastMessage: message
                }
              }
              return session;
            })
          }
        }) 
      }
    };
    socket?.on("serverMessage", handler);

    return () => {
      socket?.off("serverMessage", handler);
    };
  }, []);
  const handleSendMessage = () => {
    if (sendText.trim()) {
      setNewMessages((prev) => [
        {
          id: Math.floor(Math.random() * 100000),
          text: sendText,
          sender: {
            id: Number(user.id),
          },
          receiver: {
            id: -1,
          },
          time: "",
        },
        ...prev
      ]);

      socket?.emit("clientMessage", {
        userId: Number(user.id),
        message: sendText,
        sessionId: Number(sessionId),
      });

      setSendText("");
      setSendTextRows(1);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    else if ( e.key === "Enter" && e.shiftKey) {
      if (sendTextRows < 5) {
        setSendTextRows(sendTextRows + 1);
      }
    }
  }

  const messages = useMemo(() => {
    return (
      messagesData?.data.map((message) => ({
        id: message.id,
        text: message.attributes.text,
        time: message.attributes.createdAt,
        sender: {
          id: message.attributes.sender?.data?.id || -1,
        },
        receiver: {
          id: message.attributes.receiver?.data?.id || -1,
        },
      })) || []
    );
  }, [messagesData]);

  const totalMessages = useMemo(() => {
    return [...newMessages, ...messages];
  }, [messages, newMessages]);

  if (isLoading || isMessagesDataLoading) {
    return <Skeleton />;
  }

  return (
    <div className="md:w-3/4 flex flex-col flex-1">
      <header className={cn("bg-white py-2 px-4 text-gray-700", sessionId && "border-b")}>
        <h1 className="text-lg font-semibold">
          {sessionData?.data.attributes.name}
        </h1>
      </header>

      <div className="overflow-y-auto p-4 flex flex-1 gap-4 flex-col-reverse text-base">
        {sessionId ? <Messages messages={totalMessages} userId={user.id} /> 
        : <div className="flex-1 flex justify-center">Welcome to your chats</div>}
      </div>

      {sessionId && <footer className="bg-white border-t border-gray-300 p-4 bottom-0 w-full">
        <div className="flex items-center">
          <textarea
            placeholder="Type a message..."
            value={sendText}
            onChange={(e) => setSendText(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            className="flex-1 p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className=" bg-emerald-600 text-white px-4 py-2 rounded ml-2 text-sm hover:bg-emerald-700 hover:shadow-lg "
          >
            Send
          </button>
        </div>
      </footer>}
    </div>
  );
};

export default ChatSession;
