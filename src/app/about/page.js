import Header from "../components/Header";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>About Us</h1>
        <p>
          This page provides more information about the purpose and structure of this Next.js app.
        </p>
      </main>
    </div>
  );
}
