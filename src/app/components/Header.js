"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`${styles.link} ${pathname === "/about" ? styles.active : ""}`}
        >
          About
        </Link>
      </nav>
    </header>
  );
}
