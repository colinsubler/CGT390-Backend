import Header from "@/app/components/Header";
import styles from "./page.module.css";

async function getProfile(id) {
  const res = await fetch(`https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-id.php?id=${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch profile data");
  }
  return res.json();
}

export default async function ProfilePage({ params }) {
  const { id } = await params;

  const profile = await getProfile(id);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <img
            src={profile.image_url}
            alt={profile.name}
            className={styles.image}
          />
          <div className={styles.info}>
            <h1 className={styles.name}>{profile.name}</h1>
            <h2 className={styles.title}>{profile.title}</h2>
            <p className={styles.email}>{profile.email}</p>
            <p className={styles.bio}>{profile.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
