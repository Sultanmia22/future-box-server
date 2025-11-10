const express = require('express')
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 4011;

//! midleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iweq9cs.mongodb.net/?appName=Cluster0`;
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
        
        const artworksDB = client.db('artifyDB');
        const artworkCollection = artworksDB.collection('artworks')


        //! artwork related api
        app.get('/artworks',async(req,res) => {
            const result = await artworkCollection.find().sort({created_at:-1}).limit(6).toArray()
            res.send(result)
        })

        //! view details api 
        app.get('/viewDetails/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await artworkCollection.findOne(query)
            res.send(result)
        })

        //! count like incress in DB 
        app.patch('/likeCount/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const update = {
                $inc:{
                    like_count: 1
                }
            }

            const result = await artworkCollection.updateOne(query,update);
            res.send(result);
        })

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