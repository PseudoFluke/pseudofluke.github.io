exports.getCustomId = ({ bookingId, modifiedAt }) => {
  return bookingId + new Date(modifiedAt).getTime();
};

exports.getLatestBookingPayload = ({ compareId, index }) => ({
  index: index,
  body: {
    query: {
      match: {
        bookingId: compareId,
      },
    },
    sort: [{ "modifiedAt.keyword": { order: "desc" } }],
    size: 1,
  },
});
