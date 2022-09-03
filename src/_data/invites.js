require("dotenv").config();

const AirTable = require("airtable");

module.exports = async function () {
    const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    const inviteList = await airtableData("Invite List").select({
      view: "Grid view"
    }).all();
    const invites = [];

    const finalList = await Promise.all(inviteList.map(async (record) => {
      let inviteGuests = [];
      if(record._rawJson.fields.Invitees && record._rawJson.fields.Invitees.length > 0) {
        const guestArray = record._rawJson.fields.Invitees;
        
        newGuestArray = await guestArray.map(async guest => { 
          const a = await airtableData("Guest List").find(guest);
          console.log('a', a);
          return a._rawJson.fields;
        });

        // console.log('point a');
        inviteGuests = await Promise.all(newGuestArray);
        // inviteGuests = newGuestArray;
        // console.log('point b', inviteGuests);
        // console.log('point c', newGuestArray);

        // await Promise.all(record._rawJson.fields.Invitees.map(async (guest) => {
        //   console.log('guest', guest);
        //   if (!guest) return;

        //   console.log('a');
        //   const guestRecord = await airtableData("Guest List").find(guest);
        //   inviteGuests.push(guestRecord._rawJson.fields);
        //   console.log(inviteGuests);
        //     // , (err, record) => {
        //     //   if (err) { console.error(err); return; }
        //     //   console.log('raw', record._rawJson.fields);
        //     //   ;
        //     //   return record._rawJson.fields;
        //     // });
        //     // console.log('b');
        // }));
      }
      // console.log(inviteGuests);

      invites.push({
          "id": record._rawJson.id,
          ...record._rawJson.fields,
          "invitees": inviteGuests,
        });
      
      return {
          "id": record._rawJson.id,
          ...record._rawJson.fields,
          "people": inviteGuests,
        };
      }
    ));

    console.log('final', finalList);
    return finalList;
};


