import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import coffeStoresData from "../../data/coffee-stores.json";

export function getStaticProps({ params }) {
  return {
    props: {
      coffeeStore: coffeStoresData.find((coffeStore) => {
        return coffeStore.id.toString() === params.id;
      }),
    },
  };
}

export function getStaticPaths() {
  const paths = coffeStoresData.map((coffeStore) => {
    return {
      params: { id: coffeStore.id.toString() },
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
  const { address, name, neighbourhood } = props.coffeeStore;

  console.log(props);
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <Link href="/">
        <a>Back to home</a>
      </Link>
      <p>{address}</p>
      <p>{name}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};

export default CoffeStore;
