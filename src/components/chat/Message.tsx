import { Message } from "../../types/message.types";

const OutgoingMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex mb-4">
      <div className="flex max-w-96 bg-neutral-100 rounded-lg rounded-tl-none p-3 gap-3 text-sm">
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

const IncomingMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex max-w-96 bg-emerald-600 text-white rounded-lg rounded-tr-none p-3 gap-3 text-sm">
        <p>{message}</p>
      </div>
    </div>
  );
};

const Messages = ({
  userId,
  messages,
}: {
  userId: number;
  messages: Message[];
}) => {
  if (messages.length === 0) {
    return "No messages available";
  }

  return messages.map((message) => {
    return message.sender.id === userId ? (
      <IncomingMessage key={message.id} message={message.text} />
    ) : (
      <OutgoingMessage key={message.id} message={message.text} />
    );
  });
};

export default Messages;
