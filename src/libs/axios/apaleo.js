const axios = require("axios");
const querystring = require("querystring");
const { generateError } = require("../../utils/error");

exports.getAccessToken = async () => {
  try {
    const utf8String = Buffer.from(
      process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
    );
    const base64String = utf8String.toString("base64");
    const headers = {
      Authorization: "Basic " + base64String,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const params = querystring.stringify({ grant_type: "client_credentials" });
    const accessToken = await axios.post(process.env.TOKEN_URL, params, {
      headers,
    });
    return accessToken.data;
  } catch (error) {
    generateError({ error });
  }
};

exports.getBookings = async ({ token, params }) => {
  try {
    const requestUrl = process.env.APALEO_BASE_URL + "/booking/v1/bookings";
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if (params) {
      config[params] = params;
    }
    const bookings = await axios.get(requestUrl, config);
    return bookings.data.reservations;
  } catch (error) {
    generateError({ error });
  }
};
