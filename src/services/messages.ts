import { API } from "../constant";
import { getToken } from "../helpers";

export const getMessagesBySessionId = async ({
    sessionId
}:{
    sessionId: number
}) => {
    const token = getToken();
  const response = await fetch(`${API}/messages?populate=*&filters[session][id][$eq]=${sessionId}&sort[0]=createdAt:desc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  return result;
}