import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../store/store-context";

import { isEmpty } from "../../utils/index";

import styles from "../../styles/CoffeeStore.module.css";

export async function getStaticProps({ params }) {
  const coffeStoresData = await fetchCoffeeStores();

  const findCoffeStoreById = coffeStoresData.find((coffeStore) => {
    return coffeStore.fsq_id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeStoreById ? findCoffeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeStoresData = await fetchCoffeeStores();
  const paths = coffeStoresData.map((coffeStore) => {
    return {
      params: { id: coffeStore.fsq_id.toString() },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
}

const CoffeStore = (props) => {
  const router = useRouter();
  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {});
  const {
    state: { coffeeStoresNearMe },
  } = useContext(StoreContext);

  // console.log("nära mig", coffeeStoresNearMe);
  // console.log("coffee shops use före useeffect", coffeeStore);

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (coffeeStoresNearMe.length > 0) {
        const findCoffeStoreById = coffeeStoresNearMe.find((coffeStore) => {
          return coffeStore.fsq_id.toString() === id;
        });
        setCoffeeStore(findCoffeStoreById);
      }
    }
  }, [id]);

  // console.log("coffee shops use efter useeffect", coffeeStore);

  if (router.isFallback) {
    return <div>Loading..</div>;
  }
  console.log(coffeeStore);

  const { name, address, neighborhood } = coffeeStore;
  const handleUpvoteButton = () => {
    console.log("upvote");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>&larr; Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}> {name}</h1>
          </div>
          <Image
            src={
              coffeeStore.imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            alt={name}
            width={600}
            height={360}
            className={styles.storeImg}
          ></Image>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              alt="icon"
              width="24"
              height="24 "
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood ? (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                alt="icon"
                width="24"
                height="24 "
              />
              <p className={styles.text}>{neighborhood[0]}</p>
            </div>
          ) : (
            ""
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              alt="icon"
              width="24"
              height="24 "
            />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeStore;
