import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { Fragment } from "react";
import { fetchCoffeeStores } from "../lib/coffee-stores";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStores,
    },
  };
}

export default function Home(props) {
  const { coffeeStores } = props;
  console.log(coffeeStores);
  const handleOnBannerBtnClick = () => {
    console.log("btn clicked");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          handleOnClick={handleOnBannerBtnClick}
          buttonText="View stores nearby"
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Hero img"
          />
        </div>
        {coffeeStores.length > 0 && (
          <Fragment>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                const { name, fsq_id, imgUrl } = coffeeStore;
                return (
                  <Card
                    key={fsq_id}
                    name={name}
                    imgUrl={imgUrl}
                    href={`/coffee-store/${fsq_id}`}
                  />
                );
              })}
            </div>
          </Fragment>
        )}
      </main>
    </div>
  );
}
