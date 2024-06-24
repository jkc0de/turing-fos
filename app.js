require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use("/api/orders", orderRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
