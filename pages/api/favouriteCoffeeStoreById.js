import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { fsq_id } = req.body;
      if (fsq_id) {
        const records = await findRecordByFilter(fsq_id);

        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + 1;

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);
          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            return res.json(minifiedRecords);
          }
        } else {
          res.json({ message: "coffee store does not exist" });
        }
      } else {
        res.status(500);
        res.json({ message: "id is missing" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "error upvoting coffee store", err });
    }
  }
};

export default favouriteCoffeeStoreById;
