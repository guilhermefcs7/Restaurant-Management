import axios, { AxiosError } from "axios";

import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

import { signOut } from "../contexts/AuthContext";

export function setupAPIClient(context = undefined) {
  let cookies = parseCookies(context); // Get cookies

  const api = axios.create({
    baseURL: "http://localhost:3333", // Base url configuration
    headers: {
      Authorization: `Bearer ${cookies["@nextauth.token"]}`,
    }, // Insert token
  });

  // In case of api error because of token
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window !== undefined) {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
