import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useGetSessionDetailsById } from "../../hooks/api-hooks/useSessionQuery";
import { useGetMessagesBySessionId } from "../../hooks/api-hooks/useMessageQuery";
import { Message } from "../../types/message.types";
import { socket } from "../../socket";
import Messages from "./Message";


const ChatSession = ({ sessionId }: { sessionId: string }) => {
  const [sendText, setSendText] = useState<string>("");
  const { user } = useAuthContext();
  const { data: sessionData, isLoading } = useGetSessionDetailsById({
    sessionId: sessionId || "",
  });

  const { data: messagesData, isLoading: isMessagesDataLoading } =
    useGetMessagesBySessionId({
      sessionId: Number(sessionId || ""),
    });

  const [newMessages, setNewMessages] = useState<Message[]>([]);

  useEffect(() => {
    setNewMessages([]);
  }, [sessionId]);

  useEffect(() => {
    const handler = ({
      id,
      message,
      userId,
      name,
      createdAt,
    }: {
      id: number;
      message: string;
      userId: number;
      name: string;
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
        setNewMessages((prev) => [...prev, newMessage]);
      }
    };
    socket.on("serverMessage", handler);

    return () => {
      socket.off("serverMessage", handler);
    };
  }, []);

  const handleSendMessage = () => {
    if (sendText) {
      setNewMessages((prev) => [
        ...prev,
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
      ]);

      socket.emit("clientMessage", {
        userId: Number(user.id),
        message: sendText,
        sessionId: Number(sessionId),
      });

      setSendText("");
    }
  };

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
    return [...messages, ...newMessages];
  }, [messages, newMessages]);

  if (isLoading || isMessagesDataLoading) {
    return "Loading....";
  }

  return (
    <div className="flex-1">
      <header className="bg-white py-2 px-4 text-gray-700 border-b">
        <h1 className="text-lg font-semibold">
          {sessionData?.data.attributes.name}
        </h1>
      </header>

      <div className="h-screen overflow-y-auto p-4 pb-60 flex gap-4 flex-col-reverse text-base">
        <Messages messages={totalMessages} userId={user.id} />
      </div>

      <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full md:w-3/4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={sendText}
            onChange={(e) => setSendText(e.target.value)}
            className="w-full p-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className=" bg-emerald-600 text-white px-4 py-2 rounded ml-2 text-sm hover:bg-emerald-700 hover:shadow-lg "
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatSession;
