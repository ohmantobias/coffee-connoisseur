import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_MY_ACCES_KEY_UNSPLASH,
});

const getListOfCoffeeStoresPhoto = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  // const urls = unsplashResults.map((result) => result.urls.small);
  return unsplashResults.map((result) => result.urls.small);
};

const getUrlforCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query} stores&v=20220105&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  query = "coffee",
  limit = 10
) => {
  const photos = await getListOfCoffeeStoresPhoto();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlforCoffeeStores(latLong, query, limit),
    options
  );

  const data = await response.json();
  console.log(data);
  return data.results.map((result, index) => {
    return {
      fsq_id: result.fsq_id,
      imgUrl: photos[index],
      address: result.location.address,
      name: result.name,
      neighborhood: result.location.neighborhood
        ? result.location.neighborhood
        : "",
    };
  });
};
