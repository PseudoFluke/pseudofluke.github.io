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

module.exports = router;
