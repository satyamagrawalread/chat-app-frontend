import { useQuery } from "@tanstack/react-query";
import { getMySessions, getSessionById } from "../../services/session";
import { Session } from "../../types/session.types";

export const useGetSessionDetailsById = ({
  sessionId,
}: {
  sessionId: string;
}) => {
  return useQuery<{
    data: {
      attributes: {
        name: string;
        messages: {
          data: {
            id: number;
            attributes: {
              text: string;
              createdAt: string;
              updatedAt: string;
              publishedAt: string;
              sender?: {
                data?: {
                  id: number;
                  attributes: {
                    username: string;
                    email: string;
                    provider: string;
                    confirmed: true;
                    blocked: false;
                  };
                };
              };
              receiver?: {
                data?: {
                  id: number;
                  attributes: {
                    username: string;
                    email: string;
                    provider: string;
                    confirmed: true;
                    blocked: false;
                  };
                };
              };
            };
          }[];
        };
      };
    };
  }>({
    queryKey: ["messages", sessionId],
    queryFn: () => getSessionById(Number(sessionId)),
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetAllSessionsForUser = () => {
  return useQuery<{
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    sessions?:
      Session[];
  }>({
    queryKey: ["sessions"],
    queryFn: getMySessions,
    refetchOnWindowFocus: false,
  });
};
