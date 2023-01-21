const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// mongodb connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ee4ohgp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// CRUD operation
async function run() {
  try {
    const database = client.db("form-validation");
    const profileCollection = database.collection("profile");
    const sectorCollection = database.collection("sector");
    // get all sector from the database
    app.get("/sector", async (req, res) => {
      const result = await sectorCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    // post a profile inside the database
    app.post("/profile/post", async (req, res) => {
      const profile = req.body.data;
      const result = await profileCollection.insertOne(profile);
      res.send(result);
    });
    // get a specific user profile from the database
    app.get("/profile", async (req, res) => {
      const name = req.query.name;
      const query = { name };
      const result = await profileCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    // update a specific user profile from the database
    app.put("/profile/update", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const updateValue = req.body.data;
      console.log("updateValue", updateValue);
      const result = await profileCollection.replaceOne(filter, updateValue);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Running my node CRUD server");
});

app.listen(port, () => {
  console.log("crud server is running ");
});
