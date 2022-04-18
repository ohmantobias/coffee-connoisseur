import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  try {
    const { fsq_id, name, neighbourhood, address, imgUrl, voting } = req.body;
    console.log("hejhej", req.body);
    if (req.method === "POST") {
      if (fsq_id) {
        const records = await findRecordByFilter(fsq_id);
        console.log("createrecords", records);
        if (records.length !== 0) {
          return res.json(records);
          // const findCoffeeStoreRecords = await table
          //   .select({
          //     filterByFormula: `fsq_id="${fsq_id}"`,
          //   })
          //   .firstPage();

          // if (findCoffeeStoreRecords.length !== 0) {
          //   const records = getMinifiedRecords(findCoffeeStoreRecords);
          //   res.json(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  voting,
                  fsq_id,
                  name,
                  address,
                  neighbourhood,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);

            res.json({ records });
          } else {
            res.status(400);
            res.json({ message: "name is missing!" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "id is missing" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: "Error creating or finding a store" });
  }
};

export default createCoffeeStore;
