const axios = require("axios");
const querystring = require("querystring");
const { getAccessToken } = require("./utils");

const router = require("express").Router();

router.get("/token", async (req, res) => {
  try {
    const token = await getAccessToken();
    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/historicalbookings", async (req, res) => {
  try {
    const fromDate = "2022-03-08T05:48:31Z";
    const toDate = "2022-08-08T05:48:31Z";
    const params = {
      dateFilter: "Creation",
      from: "2022-03-08T05:48:31Z",
      to: "2022-08-08T05:48:31Z",
    };
    const token = await getAccessToken();
    const bookings = await axios.get(
      process.env.BASE_URL + "/booking/v1/reservations",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
