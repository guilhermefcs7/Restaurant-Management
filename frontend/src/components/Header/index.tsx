import React, { useContext } from "react";

import styles from "./styles.module.scss";
import Link from "next/link";

import { FiLogOut } from "react-icons/fi";

import { AuthContext } from "@/src/contexts/AuthContext";

export function Header() {
  const { signOut } = useContext(AuthContext);
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">Logo</Link>

        <nav className={styles.menuNav}>
          <Link href="/category">
            <span>Categoria </span>
          </Link>

          <Link href="/product">
            <span>Cardápio </span>
          </Link>

          <button onClick={signOut}>
            <FiLogOut color="#fff" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
