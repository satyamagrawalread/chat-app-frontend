import { useQuery } from "@tanstack/react-query";
import { getMessagesBySessionId } from "../../services/messages";

export const useGetMessagesBySessionId = ({
  sessionId,
}: {
  sessionId: number;
}) => {
  return useQuery<{
    data: {
      id: number;
      attributes: {
        createdAt: string;
        text: string;
        updatedAt: string;
        publishedAt: string;
        sender: {
          data: {
            id: number;
            attributes: {
              username: string;
              email: string;
              provider: string;
              confirmed: true;
              blocked: false;
              createdAt: string;
              updatedAt: string;
            };
          };
        };
        session: {
          data: {
            id: number;
            attributes: {
              name: string;
              lastMessage: string;
              createdAt: string;
              updatedAt: string;
              publishedAt: string;
            };
          };
        };
        receiver: {
          data: {
            id: number;
            attributes: {
              username: string;
              email: string;
              provider: string;
              confirmed: true;
              blocked: false;
              createdAt: string;
              updatedAt: string;
            };
          };
        };
      };
    }[];
  }>({
    queryKey: ["getMessagesBySessionId", sessionId],
    queryFn: () => getMessagesBySessionId({
        sessionId,
    }),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
