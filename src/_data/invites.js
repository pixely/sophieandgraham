require('dotenv').config();

const AirTable = require('airtable');

module.exports = async function () {
    const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    const guests = await airtableData('Guest List').select({
      view: "Grid view"
    }).all();
    const invites = [];
    
    guests.forEach((record) => {
        invites.push({
          "id" : record._rawJson.id,
          ...record._rawJson.fields
        });
      }
    );

    return invites;
};


