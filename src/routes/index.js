const { Router } = require("express");

const router = Router();

const custom = require("../modules/apaleo/router");

router.use("/custom", custom);

module.exports = router;
