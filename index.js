const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const apaleoRoutes = require("./routes");

dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api/apaleo", apaleoRoutes);

app.get("/", async (req, res) => {
  return res.status(200).send("Backend server is up and running!");
});

app.listen(process.env.PORT || 8800, async (req, res) => {
  console.log("Backend server is running!");
});
