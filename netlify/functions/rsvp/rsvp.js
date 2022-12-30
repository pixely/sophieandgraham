require("dotenv").config();

const AirTable = require("airtable");

const handler = async (event) => {
  try {
    const subject = event.queryStringParameters.name || 'World';
    const params = JSON.parse(event.body);

    const inviteId = params.invite;
    const invitees = params.guests?.split(',');

    let updatedRecords = 0;

    const retrieveFromParams = (guestId, paramKey) => {
      return params[`${guestId}-${paramKey}`].replace(`${guestId}-`,'');
    };

    const formatGuestUpdate = (guests) => {
      return guests.map((guest) => ({
          id: guest,
          fields: {
            "Attending": retrieveFromParams(guest, "attend"),
            "Menu Choice": [retrieveFromParams(guest, "meal")],
            "Dietary Requirements": retrieveFromParams(guest, "dietary"),
          },
        })
      );
    };

    
    // if (inviteId && invitees) {
      const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
      
      // const results = await airtableData("Guest List").update(formatGuestUpdate(invitees), function(err, records) {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      //   // console.log(records);
      //   // return records;
      //   return records.forEach(function(record) {
      //     // console.log('b', record);
      //     updatedRecords++;
      //     console.log('record foreach');
      //     return record.get('Invite List');
      //   });
      // });
      
      const results = await airtableData("Guest List").update(formatGuestUpdate(invitees));

      console.log(results);
      

      console.log(updatedRecords);
      
      if (invitees.length === updatedRecords) {
        console.log('all good');
      } else {
        console.log('error');
      }
      

    // }


    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}`, ...params }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
