import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

import styles from "../../styles/CoffeeStore.module.css";

export async function getStaticProps({ params }) {
  const coffeStoresData = await fetchCoffeeStores();

  return {
    props: {
      coffeeStore: coffeStoresData.find((coffeStore) => {
        return coffeStore.fsq_id.toString() === params.id;
      }),
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

  if (router.isFallback) {
    return <div>Loading..</div>;
  }
  const { address } = props.coffeeStore.location;

  console.log(props);
  const handleUpvoteButton = () => {
    console.log("upvote");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{props.coffeeStore.name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>&larr; Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}> {props.coffeeStore.name}</h1>
          </div>
          <Image
            src={props.coffeeStore.imgUrl}
            alt={props.coffeeStore.name}
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
          {props.coffeeStore.location.neighborhood ? (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                alt="icon"
                width="24"
                height="24 "
              />
              <p className={styles.text}>
                {props.coffeeStore.location.neighborhood[0]}
              </p>
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
