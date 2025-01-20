const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
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
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const database = client.db("CineflixDB");
    const addmovies = database.collection("addmovies");
    const favmovies = database.collection("favmovies");
    const featuredmovies = database.collection("featuredmovies");

    app.get('/featuredmovies', async (req, res) => {
      const cursor = featuredmovies.find().sort({ rating: -1 }); 
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/featuredmovies/:id' , async (req , res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await featuredmovies.findOne(query);
      res.send(result)
    })

    app.post('/addmovies' , async(req , res)=>{
        const newMovie = req.body;
        console.log(newMovie);
        const result = await addmovies.insertOne(newMovie);
        res.send(result);
    })

    app.get('/addmovies' , async(req , res)=>{
        const cursor = addmovies.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/addmovies/:id' , async (req , res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await addmovies.findOne(query);
        res.send(result)
      })

      app.delete('/addmovies/:id', async (req, res) => {
        const id = req.params.id;
        console.log(`Deleting movie with ID: ${id}`); 
          const query = { _id: new ObjectId(id) }; 
          const result = await addmovies.deleteOne(query);
          res.send(result);
      });

      app.post('/favmovies' , async(req , res)=>{
        const favMovie = req.body;
        console.log(favMovie);
        const existingMovie = await favmovies.findOne({ email: favMovie.email, title: favMovie.title });
        if (existingMovie) {
            return res.status(400).json({ message: "Movie already in favorites" });
        }
        const result = await favmovies.insertOne(favMovie);
        res.send(result);
    })

    app.get('/favmovies' , async(req , res)=>{
        const cursor = favmovies.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.delete('/favmovies/:id' , async (req , res)=>{
        const id = req.params.id;
        const query = {_id: id}
        const result = await favmovies.deleteOne(query);
        res.send(result)
      })

      app.get('/update/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await addmovies.findOne(query);
        res.send(result);
      });
      
    
      app.put('/update/:id' , async(req , res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updatedMovie = req.body
        const updateDoc  = {
          $set: {
            poster:updatedMovie.poster , title:updatedMovie.title , genre:updatedMovie.genre , duration:updatedMovie.duration , releaseYear:updatedMovie.releaseYear , rating:updatedMovie.rating , summary:updatedMovie.summary
          }
        }
        const result = await addmovies.updateOne(filter , updateDoc  , options)
        res.send(result);
      })


    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req , res)=>{
    res.send('Server is running')
})

app.listen(port , () =>{
    console.log(`Coffee server is running on port ${port}`)
})