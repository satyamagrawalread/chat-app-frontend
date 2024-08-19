import { API } from "../constant";
import { getToken } from "../helpers";

export async function getSessionById(sessionId: number) {
  const token = getToken();
  const response = await fetch(`${API}/sessions/${sessionId}?populate[messages][populate]=*`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  return result;
}


export async function getMySessions() {
  console.log("getMySession")
  const token = getToken();
  const response = await fetch(`${API}/users/me?populate=*`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  });
  const result = await response.json();
  return result;
}
