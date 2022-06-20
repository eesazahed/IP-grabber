require("dotenv").config();

const app = require("express")();

app.set("view engine", "ejs");

const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(async (req, res) => {
  let forwarded = req.headers["x-forwarded-for"];
  let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

  const url =
    "mongodb+srv://NOT_MY_USERNAME:NOT_MY_PASSWORD@NOT_MY_DB.knkja.mongodb.net/DB?retryWrites=true&w=majority";
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

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

  res.render("index");
});

app.listen(port);
