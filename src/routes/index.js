const { Router } = require("express");

const router = Router();

const custom = require("../modules/custom/router");

router.use("/custom", custom);

module.exports = router;
