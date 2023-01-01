require("dotenv").config();

const AirTable = require("airtable");

const handler = async (event) => {
  try {
    const params = JSON.parse(event.body);
    let inviteId;
    let updateSuccess = false;

    const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);

    if (params['invite']) {
      const invite = await airtableData("Invite List").find(params['invite']);
      if(invite?.id) {
        inviteId = [invite.id];
      }
    }

    const results = await airtableData("Messages").create([
      {
        fields: {
          "Name": params['name'],
          "Email Address": params['email'],
          "Message": params['message'],
          "Form": params['form-name'],
          "Invite": inviteId,
        }
      },
    ]);

    if (results.length === 1) {
      updateSuccess = true;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: updateSuccess }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
