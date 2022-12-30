require("dotenv").config();

const AirTable = require("airtable");

const handler = async (event) => {
  try {
    const inviteCode = event.queryStringParameters.invite;
    let valid = false;
    let id = null;

    if (inviteCode ) {
      const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
      const inviteList = await airtableData("Invite List").select({
        view: "Grid view",
        filterByFormula: `{Invite Code} = "${inviteCode.toUpperCase().trim()}"`,
        maxRecords: 1,
      }).all();
      if (inviteList.length === 1) {
        valid = true;
        id = inviteList[0].fields['Invite Code'];
        console.log(inviteList);
      }
    }
     
    return {
      statusCode: 200,
      body: JSON.stringify({ inviteFound: valid, inviteCode: id }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
