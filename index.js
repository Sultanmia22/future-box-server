const express = require('express')
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 4011;

//! midleware 
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://artifyDB:NNRMKZVl9jwnlzpz@cluster0.iweq9cs.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();
        
        const artworksDB = client.db('artworkDB');
        const artworkCollection = artworksDB.collection('artworks')

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server Running...')
})

app.listen(port, () => {
    console.log('server port number = ', port)
})