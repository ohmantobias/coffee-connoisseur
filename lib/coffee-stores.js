import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.MY_ACCES_KEY_UNSPLASH,
});

const getListOfCoffeeStoresPhoto = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 10,
  });
  const unsplashResults = photos.response.results;
  // const urls = unsplashResults.map((result) => result.urls.small);
  return unsplashResults.map((result) => result.urls.small);
};

const getUrlforCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query} stores&v=20220105`;
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStoresPhoto();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlforCoffeeStores("43.65267326999575,-79.39545615725015", "coffee"),
    options
  );

  const data = await response.json();

  return data.results.map((result, index) => {
    return {
      ...result,
      imgUrl: photos[index],
    };
  });
};
