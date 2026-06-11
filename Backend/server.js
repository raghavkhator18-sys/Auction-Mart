require("dotenv").config({ path: "../.env" });
const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});