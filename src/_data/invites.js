require("dotenv").config();

const AirTable = require("airtable");
const { DateTime } = require("luxon");

module.exports = async function () {
    const airtableData = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
    const inviteList = await airtableData("Invite List").select({
      view: "Grid view",
    }).all();

    const finalList = await Promise.all(inviteList.map(async (record) => {
      let inviteGuests = [];
      if(record._rawJson.fields.Invitees && record._rawJson.fields.Invitees.length > 0) {
        const guestArray = record._rawJson.fields.Invitees;
        
        newGuestArray = await guestArray.map(async guest => { 
          const a = await airtableData("Guest List").find(guest);
          return {
            "id": a._rawJson.id,
            ...a._rawJson.fields,
          }
        });

        inviteGuests = await Promise.all(newGuestArray);
      }
      
      const deadline = DateTime.fromISO(record._rawJson.fields['Deadline']);

      const getNumberSuffix = (num) => {
        const th = 'th'
        const rd = 'rd'
        const nd = 'nd'
        const st = 'st'
      
        if (num === 11 || num === 12 || num === 13) return th
      
        let lastDigit = num.toString().slice(-1)
      
        switch (lastDigit) {
          case '1': return st
          case '2': return nd
          case '3': return rd
          default:  return th
        }
      }

      return {
          "id": record._rawJson.id,
          ...record._rawJson.fields,
          "people": inviteGuests,
          formatted_deadline: `${deadline.toFormat('d')}${getNumberSuffix(deadline.toFormat('d'))} ${deadline.toFormat('MMMM')}`,
          formatted_deadline_with_year: `${deadline.toFormat('d')}${getNumberSuffix(deadline.toFormat('d'))} ${deadline.toFormat('MMMM yyyy')}`,
          within_deadline: DateTime.now() <= deadline.endOf('day'),
        };
      }
    ));

    // console.log('final', finalList);
    return finalList;
};


