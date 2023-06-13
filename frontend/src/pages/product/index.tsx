import Head from "next/head";
import styles from "./styles.module.scss";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { Header } from "@/src/components/Header";
import { FiUpload } from "react-icons/fi";
import { ChangeEvent, FormEvent, useState } from "react";
import { setupAPIClient } from "@/src/services/api";
import { toast } from "react-toastify";

type itemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: itemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList || []);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const image = event.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(event.target.files[0]));
    }
  }

  function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>) {
    const value = Number(event.target.value);
    setSelectedCategory(value);
  }

  async function handleRegisterProduct(event: FormEvent) {
    event.preventDefault();

    try {
      const data = new FormData();

      if (
        name === "" ||
        price === "" ||
        description === "" ||
        imageAvatar === null
      ) {
        toast.error("Preencha todos os campos!");

        return;
      }

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[selectedCategory].id);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post("/product", data);

      toast.success("Produto cadastrado com sucesso!");
    } catch (error) {
      toast.error("Ops erro ao cadastrar!");
    }

    setAvatarUrl("");
    setImageAvatar(null);
    setName("");
    setPrice("");
    setDescription("");
  }

  return (
    <>
      <Head>
        <title>Cadastre um novo produto</title>
      </Head>

      <Header />

      <main className={styles.container}>
        <h1>Novo produto</h1>

        <form onSubmit={handleRegisterProduct} className={styles.form}>
          <label className={styles.labelAvatar}>
            <span>
              <FiUpload size={30} color="#fff" />
            </span>

            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFile}
            />

            {avatarUrl && (
              <img
                className={styles.preview}
                src={avatarUrl}
                alt="Foto do produto"
                width={250}
                height={250}
              />
            )}
          </label>

          <select value={selectedCategory} onChange={handleChangeCategory}>
            {categories.map((item, index) => {
              return (
                <option key={item.id} value={index}>
                  {item.name}
                </option>
              );
            })}
          </select>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="digite o nome do produto"
            className={styles.input}
          />

          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            type="text"
            placeholder="digite o preço do produto"
            className={styles.input}
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descreva seu produto"
            className={styles.input}
          />

          <button className={styles.buttonAdd} type="submit">
            Cadastrar
          </button>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  const apiClient = setupAPIClient(context);

  const response = await apiClient.get("/category");

  return {
    props: {
      categoryList: response.data,
    },
  };
});
