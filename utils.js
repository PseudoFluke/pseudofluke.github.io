const axios = require("axios");
const querystring = require("querystring");

exports.getAccessToken = async () => {
  try {
    const utf8String = Buffer.from(
      process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
    );
    const base64String = utf8String.toString("base64");
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + base64String,
    };
    const body = querystring.stringify({ grant_type: "client_credentials" });
    const accessToken = await axios.post(process.env.TOKEN_URL, body, {
      headers: headers,
    });
    return accessToken.data;
  } catch (error) {
    console.log(error);
  }
};

