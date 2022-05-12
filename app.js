require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://NOT_MY_USERNAME:NOT_MY_PASSWORD@NOT_MY_DB.knkja.mongodb.net/DB?retryWrites=true&w=majority";
const client = new MongoClient(url);

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", async (req, res) => {
  let forwarded = req.headers["x-forwarded-for"];
  let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

  try {
    await client.connect();
    const col = client.db("DB").collection("logs");
    await col.insertOne({
      ip: ip,
      timestamp: new Date().getTime(),
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }

  res.render(path.join(__dirname, "/index.html"));
});

app.listen(port, (req, res) =>
  console.log(`Running on http://localhost:${port}`)
);
