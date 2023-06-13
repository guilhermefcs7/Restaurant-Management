import { AuthProvider } from "../contexts/AuthContext";

import { ToastContainer } from "react-toastify";

import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
    </AuthProvider>
  );
}
