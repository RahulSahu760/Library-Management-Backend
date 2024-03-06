const express = require("express");
const cors = require("cors");
const db = require("./database");
const routes = require("./Routes");

const app = express();
const PORT = 3001;

app.use(cors());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello World, This is server");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
