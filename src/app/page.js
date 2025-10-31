import Header from "./components/Header";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Welcome to the Home Page</h1>
        <p>This is the main landing page of your Next.js app.</p>
      </main>
    </div>
  );
}
