const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const excuseRoute = require("./excuseAgent");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", excuseRoute);

module.exports = app;
