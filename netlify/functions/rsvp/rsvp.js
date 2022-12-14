require("dotenv").config();

const AirTable = require("airtable");

const handler = async (event) => {
  try {
    const params = JSON.parse(event.body);
    const inviteId = params.invite;
    const invitees = params.guests?.split(',');

    let updateSuccess = false;
    let updatedRecords = 0;

    const retrieveFromParams = (guestId, paramKey) => {
      const param = params[`${guestId}-${paramKey}`]?.replace(`${guestId}-`,'');
      
      return typeof param === 'string' && param?.length === 0 ? null : param; 
    };

    const arrayIfThere = (param) => {
      if (param) {
        return [param];
      }
      return param;
    };

    const formatGuestUpdate = (guests) => {
      return guests.map((guest) => {
        let name = {};
        const nameParam = retrieveFromParams(guest, "name");
        if (nameParam?.length > 0) {
          name['Name'] = nameParam;
        };

        return {
            id: guest,
            fields: {
              "Attending": retrieveFromParams(guest, "attend"),
              "Menu Choice": arrayIfThere(retrieveFromParams(guest, "meal")),
              "Dietary Requirements": retrieveFromParams(guest, "dietary"),
              ...name,
            },
          };
      });
    };

    const rsvpType = (guests) => {
      let count = guests.length;
      let attend = 0;
      let decline = 0;
      let type = 'mixed';

      guests.forEach((guest) => {
          const attending = retrieveFromParams(guest, "attend");
          if (attending == 'yes') {
            attend++;
          } else if (attending == 'no') {
            decline++;
          }

          if (retrieveFromParams(guest, "name") === null) {
            count--;
          };
        });

      if(attend == count) {
        type = 'yes';
      } else if (decline == count) {
        type = 'no';
      }

      return type;
    };

    const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    const invite = await airtableData("Invite List").find(inviteId);

    if (inviteId && invitees) {
      
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
      
      if (invitees.length === results.length) {
        updateSuccess = true;

        await airtableData("Invite List").update([{
          id: inviteId,
          fields: {
            "Status": invite.fields['Status'] == "Saved" ? "Saved & Updated" : "Saved",
          }
        }]);
      } else {
        console.log('error');
      }      

    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: updateSuccess, type: rsvpType(invitees), inviteCode: invite.fields['Invite Code'] }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
