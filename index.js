const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umppp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {  
  try {

    const database = client.db("CineDB")
    const addWatchlist = database.collection("addWatchlist")

    app.post('/watchlist', async (req, res) => {
      const newWatchlist = req.body;
      console.log(newWatchlist);
      const result = await addWatchlist.insertOne(newWatchlist);
      res.send(result);
    })

    app.get('/watchlist', async (req, res) => {
      const cursor = addWatchlist.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
}) 
