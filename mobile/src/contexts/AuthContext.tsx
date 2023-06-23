import React, { createContext, useState, ReactNode, useEffect } from "react";
import { api } from "../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  loadingAuth: boolean;
  userIsLoading: boolean;

  SignIn: (credentials: SignInProps) => Promise<void>;
  SignOut: () => void;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
  });

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [userIsLoading, setUserIsLoading] = useState(true);

  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      const userInfo = await AsyncStorage.getItem("@userInfo");

      let hasUser: UserProps = JSON.parse(userInfo || "{}");

      if (Object.keys(hasUser).length > 0) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${hasUser.token}`;

        const { id, email, name, token } = hasUser;

        setUser({
          id,
          email,
          name,
          token,
        });
      }

      setUserIsLoading(false);
    }

    getUser();
  }, []);

  async function SignIn({ email, password }: SignInProps) {
    setLoadingAuth(true);

    try {
      const response = await api.post("/session", { email, password });

      const { id, name, token } = response.data;

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@userInfo", JSON.stringify(data));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({ id, name, email, token });

      setLoadingAuth(false);
    } catch (error) {
      console.log("erro ao acessar", error);
      setLoadingAuth(false);
    }
  }

  async function SignOut() {
    await AsyncStorage.clear().then(() => {
      setUser({
        id: "",
        email: "",
        name: "",
        token: "",
      });
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loadingAuth,
        userIsLoading,
        SignIn,
        SignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
