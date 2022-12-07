const { Client } = require("@elastic/elasticsearch");
const { getCustomId, getLatestBookingPayload } = require("./utils");

const client = new Client({
  node: process.env.ES_ENDPOINT,
  auth: {
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD,
  },
});

exports.addToES = async ({ data, index }) => {
  let bookingId;
  let modifiedAt;
  if (data.bookingId && data.modifiedAt) {
    bookingId = data.bookingId;
    modifiedAt = data.modifiedAt;
  } else {
    const booking = JSON.parse(data.raw);
    bookingId = booking.bookId;
    modifiedAt = booking.modified;
  }
  await client.index({
    index: index,
    id: getCustomId({
      bookingId,
      modifiedAt,
    }),
    body: data,
  });
};

exports.indexExist = async ({ index }) => {
  const retrievedIdx = await client.indices.exists({
    index,
  });
  if (retrievedIdx) {
    return true;
  } else {
    return false;
  }
};

exports.getLatestBooking = async ({ compareId, index }) => {
  const queryPayload = getLatestBookingPayload({ compareId, index });
  const existingBooking = await client.search(queryPayload);
  if (existingBooking.hits.hits.length === 0) {
    return;
  } else {
    return JSON.parse(existingBooking.hits.hits[0]._source.raw);
  }
};
