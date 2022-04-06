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
