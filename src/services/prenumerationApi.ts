import Constants from "expo-constants";

import { NyPrenumeration, Prenumeration } from "@/types/prenumeration";

const API_PORT = 5175;

function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";
  return `http://${host}:${API_PORT}`;
}

export const API_BASE_URL = getApiBaseUrl();
const API_URL = `${API_BASE_URL}/api/prenumerationer`;

export function getFileUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

async function request(url: string, options?: RequestInit) {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Kunde inte ansluta till servern.");
  }
  if (!response.ok) {
    const contentType = response.headers.get("Content-Type") ?? "";
    const message = contentType.startsWith("text/plain")
      ? await response.text()
      : `Servern svarade med felkod ${response.status}.`;
    throw new Error(message);
  }
  return response;
}

export async function getPrenumerationer(): Promise<Prenumeration[]> {
  const response = await request(API_URL);
  return response.json();
}

export async function getPrenumeration(id: number): Promise<Prenumeration> {
  const response = await request(`${API_URL}/${id}`);
  return response.json();
}

export async function createPrenumeration(prenumeration: NyPrenumeration): Promise<Prenumeration> {
  const response = await request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prenumeration),
  });
  return response.json();
}

export async function updatePrenumeration(prenumeration: Prenumeration): Promise<void> {
  await request(`${API_URL}/${prenumeration.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prenumeration),
  });
}
