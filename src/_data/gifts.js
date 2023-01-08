require("dotenv").config();

const AirTable = require("airtable");

module.exports = async function () {
    const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    const giftList = await airtableData("Gifts").select({
      view: "Grid view",
      sort: [{
        field: "Display Order",
        direction: "asc",
      }],
    }).all();
    // const menus = [];

    const gifts = await Promise.all(giftList.map(async (record) => {
      
      return {
          "id": record._rawJson.id,
          ...record._rawJson.fields,
        };
      }
    ));

    return gifts;
};


