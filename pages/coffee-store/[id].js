import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import useSWR from "swr";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty, fetcher } from "../../utils/index";

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

const CoffeeStore = (props) => {
  const router = useRouter();
  const routerId = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {});
  const [votingCount, setVotingCount] = useState(0);
  const {
    state: { coffeeStoresNearMe },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStoreData) => {
    const { name, voting, imgUrl, address, neighborhood, fsq_id } =
      coffeeStoreData;

    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          voting: 0,
          imgUrl,
          address: address ? address : "",
          neighborhood: neighborhood ? neighborhood : "",
          fsq_id,
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (coffeeStoresNearMe.length > 0) {
        const findCoffeeStoreById = coffeeStoresNearMe.find((coffeeStore) => {
          return coffeeStore.fsq_id.toString() === routerId;
        });

        if (findCoffeeStoreById) {
          setCoffeeStore(findCoffeeStoreById);
          handleCreateCoffeeStore(findCoffeeStoreById);
        }
      }
    } else {
      handleCreateCoffeeStore(coffeeStore);
    }
  }, [routerId]);

  const { name = "", address = "", neighborhood = "" } = coffeeStore;

  const { data, error } = useSWR(
    `/api/getCoffeeStoreById?id=${routerId}`,
    fetcher
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading..</div>;
  }

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fsq_id: routerId,
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.log(err);
    }
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
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
