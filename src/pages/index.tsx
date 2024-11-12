import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Web-Based Gif Maker</title>
        <meta
          name="description"
          content="This website is a gif-maker using the gif-encoder package"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="*******************" // TO-DO: update with correct favicon ico, and placeholder text for home page
        />
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.body}>
          <h1 className={styles.header}>Web-Based Gif Maker</h1>
          <div className={styles.content}>
              Placeholder text
          </div>
        </div>
      </main>
    </>
  );
}
