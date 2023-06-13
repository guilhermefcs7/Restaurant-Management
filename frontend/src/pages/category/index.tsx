import Head from "next/head";

import styles from "./styles.module.scss";

import { Header } from "@/src/components/Header";
import { FormEvent, useState } from "react";

import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Category() {
  const [name, setName] = useState("");

  async function handleRegisterCategory(event: FormEvent) {
    event.preventDefault();

    if (name === "") {
      return;
    }

    const apiClient = setupAPIClient();

    await apiClient.post("/category", {
      name,
    });

    toast.success("Categoria cadastrada com sucesso!");

    setName("");
  }

  return (
    <div>
      <Head>
        <title>Cadastre uma categoria</title>
      </Head>
      <Header />

      <main className={styles.container}>
        <h1>Cadastrar categorias</h1>

        <form onSubmit={handleRegisterCategory} className={styles.form}>
          <input
            type="text"
            placeholder="Digite o nome da categoria"
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <button className={styles.buttonAdd} type="submit">
            Cadastrar
          </button>
        </form>
      </main>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
