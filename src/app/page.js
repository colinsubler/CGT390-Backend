"use client";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [titles, setTitles] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadTitles() {
      const res = await fetch("https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php");
      const data = await res.json();
      setTitles(data?.titles || []);
    }
    loadTitles();
  }, []);

  useEffect(() => {
    async function loadProfiles() {
      const res = await fetch(
        `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=${encodeURIComponent(
          title
        )}&search=${encodeURIComponent(search)}&limit=1000`
      );
      const data = await res.json();
      setProfiles(data?.profiles || []);
    }
    loadProfiles();
  }, [title, search]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Profiles</h1>
        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <select
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.select}
          >
            <option value="">All Titles</option>
            {titles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className={styles.input}
          />

          <button type="button" className={styles.button}>
            Filter
          </button>

          <Link href="/" onClick={() => { setTitle(""); setSearch(""); }}>
            Clear
          </Link>
        </form>

        <ul className={styles.profileList}>
          {profiles.length === 0 ? (
            <p>No profiles found.</p>
          ) : (
            profiles.map((profile) => (
              <li
                key={profile.id}
                className={styles.profileItem}
                onClick={() => router.push(`/profile/${profile.id}`)}
              >
                <img
                  src={profile.image_url}
                  alt={profile.name}
                  className={styles.profileImage}
                />
                <div>
                  <h2>{profile.name}</h2>
                  <p>{profile.title}</p>
                  <p>{profile.email}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
