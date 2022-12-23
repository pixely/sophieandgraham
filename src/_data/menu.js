require("dotenv").config();

const AirTable = require("airtable");

module.exports = async function () {
    const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    const menuList = await airtableData("Menu").select({
      view: "Grid view",
      sort: [{
        field: "Display Order",
        direction: "asc",
      }],
    }).all();
    // const menus = [];

    const menus = await Promise.all(menuList.map(async (record) => {
      
      return {
          "id": record._rawJson.id,
          ...record._rawJson.fields,
        };
      }
    ));

    return menus;
};


