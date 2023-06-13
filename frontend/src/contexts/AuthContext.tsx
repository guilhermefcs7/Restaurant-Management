import { createContext, ReactNode, useState, useEffect } from "react";

import { destroyCookie, setCookie, parseCookies } from "nookies";

import { api } from "../services/apiClient";

import Router from "next/router";
import { toast } from "react-toastify";

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");

    Router.push("/");
  } catch (error) {
    console.log("Logout error");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(() => {
    // validate user info

    const { "@nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/userInfo")
        .then((response) => {
          const { id, name, email } = response.data;

          setUser({
            id,
            name,
            email,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    const payload = {
      email,
      password,
    };

    try {
      const response = await api.post("/session", payload);

      const { token, id, name } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // Expires in 30 days
        path: "/", // Which paths will be access to token, in this case, all of paths
      });

      setUser({
        id,
        name,
        email,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`; // Sends token to all next reqs

      toast.success("Login efetuado com sucesso");

      Router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao acessar");

      console.log("Error to access", error);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    const payload = {
      name,
      email,
      password,
    };

    try {
      const response = await api.post("/users", payload);

      toast.success("Login efetuado com sucesso");

      Router.push("/");
    } catch (error) {
      toast.error("Erro ao acessar");

      console.log("Error to signup", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
