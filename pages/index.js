import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner";
import Card from "../components/card";
import { Fragment } from "react";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../store/store-context";
import { ACTION_TYPES } from "../store/store-context";

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
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  // const [coffeeStoresNearMe, setCoffeeStoresNearMe] = useState([]);
  const { dispatch, state } = useContext(StoreContext);

  useEffect(() => {
    const fetchCoffeeStoresNearby = async () => {
      if (state.latLong) {
        try {
          const fetchedCoffeeStores = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${state.latLong}&limit=30`
          );
          const coffeeStoresNearMe = await fetchedCoffeeStores.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStoresNearMe },
          });
          // setCoffeeStoresNearMe(fetchedCoffeeStores);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchCoffeeStoresNearby();
  }, [state.latLong, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
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
          buttonText={`${
            !isFindingLocation ? "View stores nearby" : "...locating"
          } `}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Hero img"
          />
        </div>
        {state.coffeeStoresNearMe.length > 0 && (
          <Fragment>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {state.coffeeStoresNearMe.map((coffeeStore) => {
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
