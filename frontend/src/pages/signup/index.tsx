import Head from "next/head";

import styles from "../../styles/home.module.scss";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import Image from "next/image";

import Link from "next/link";

import Logo from "../../../public/logo.png";
import { FormEvent, useState, useContext } from "react";
import { AuthContext } from "@/src/contexts/AuthContext";
import { toast } from "react-toastify";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { signUp } = useContext(AuthContext);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "" || name === "") {
      toast.warning("Preencha todos os campos");

      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password,
    };

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro</title>
      </Head>

      <div className={styles.containerCenter}>
        <Image src={Logo} alt="Logo" />

        <div className={styles.login}>
          <h1>Criando sua conta</h1>
          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>

          <Link href="/">
            <div className={styles.text}>Já possui uma conta? Faça login</div>
          </Link>
        </div>
      </div>
    </>
  );
}
