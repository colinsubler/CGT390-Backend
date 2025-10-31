import Header from "./components/Header";
import styles from "./page.module.css";
import Link from "next/link";

async function getTitles() {
  const response = await fetch(
    "https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php",
    { next: { revalidate: 60 } }
  );
  const data = await response.json();
  return data ? data.titles : [];
}

async function getProfiles(title, search) {
  const response = await fetch(
    `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=${encodeURIComponent(title || "")}&search=${encodeURIComponent(search || "")}&limit=1000`,
    { next: { revalidate: 60 } }
  );
  const data = await response.json();
  return data ? data.profiles : [];
}

export default async function HomePage({ searchParams }) {
  const { title = "", search = "" } = searchParams || {};
  const [titles, profiles] = await Promise.all([
    getTitles(),
    getProfiles(title, search),
  ]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Profiles</h1>
        <form action="/" method="get">
          <select name="title" defaultValue={title} className={styles.select}>
            <option value="">All Titles</option>
            {titles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by name"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Filter
          </button>
          <Link href="/">Clear</Link>
        </form>
        <ul className={styles.profileList}>
          {profiles.map((profile) => (
            <li key={profile.id} className={styles.profileItem}>
              <h2>{profile.name}</h2>
              <p>Title: {profile.title}</p>
              <p>Email: {profile.email}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
