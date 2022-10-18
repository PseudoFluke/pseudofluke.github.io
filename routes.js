const axios = require("axios");
const querystring = require("querystring");
const { getAccessToken } = require("./utils");

const router = require("express").Router();

//FETCH ACCESS TOKEN FOR API REQUESTS
router.get("/token", async (req, res) => {
  try {
    const token = await getAccessToken();
    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//FETCH BOOKINGS BY FILTERING THEM BASED ON CERTAIN DATES
router.get("/historicalbookings", async (req, res) => {
  try {
    const fromDate = "2022-03-08T05:48:31Z";
    const toDate = "2022-08-08T05:48:31Z";
    const params = {
      dateFilter: "Creation",
      from: "2022-03-08T05:48:31Z",
      to: "2022-08-08T05:48:31Z",
    };
    const tokenData = await getAccessToken();
    const token = tokenData.access_token;
    const bookings = await axios.get(
      process.env.BASE_URL + "/booking/v1/reservations",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
        params,
      }
    );
    return res.status(200).json(bookings.data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//SUBSCRIBE TO A WEBHOOK
router.post("/subscribe", async (req, res) => {
  try {
    const tokenData = await getAccessToken();
    const token = tokenData.access_token;
    const res = await axios.post(process.env.ADD_WEBHOOK_URL, req.body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.status(200).json(res.data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//READ INCOMING NOTIFICATIONS FOR BOOKINGS
router.post("/bookingsweb", async (req, res) => {
  return res.status(200).send("Success!");
});

module.exports = router;
