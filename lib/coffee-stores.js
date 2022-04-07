const getUrlforCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query} stores&v=20220105`;
};

export const fetchCoffeeStores = async () => {
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

  return data.results;
};
