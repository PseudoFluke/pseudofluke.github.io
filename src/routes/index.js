const { Router } = require("express");

const router = Router();

const apaleo = require("../modules/apaleo/router");

router.use("/apaleo", apaleo);

module.exports = router;
