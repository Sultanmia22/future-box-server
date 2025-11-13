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
        strict: false,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // await client.connect();

        const artworksDB = client.db('artifyDB');
        const artworkCollection = artworksDB.collection('artworks');
        const favourtiteCollection = artworksDB.collection('favouriteArtworks');


        //! artwork related api
        app.get('/artworks', async (req, res) => {
            const result = await artworkCollection.find().sort({ created_at: -1 }).limit(6).toArray()
            res.send(result)
        })

        //! view details api 
        app.get('/viewDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await artworkCollection.findOne(query)
            res.send(result)
        })

        //! count like incress in DB 
        app.patch('/likeCount/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = {
                $inc: {
                    like_count: 1
                }
            }

            const result = await artworkCollection.updateOne(query, update);
            res.send(result);
        })

        //! Insert favourite artwork in favoutite db
        app.post('/favouriteArt', async (req, res) => {
            const favData = req.body;
            const result = await favourtiteCollection.insertOne(favData)
            res.send(result)
        })

        //! explore artwork api 
        app.get('/explore', async (req, res) => {
            const result = await artworkCollection.find().toArray();
            res.send(result);
        })

        //! Search artwork api 
        app.get('/search', async (req, res) => {
            const searchText = req.query.search;
            const result = await artworkCollection.find({ title: { $regex: searchText, $options: 'i' } }).toArray();
            res.send(result);
        })

        //! My Favourite artwork api
        app.get('/myfavourite', async (req, res) => {
            const email = req.query.email;
            const result = await favourtiteCollection.find({ user_email: email }).toArray();
            res.send(result)
        })

        //! unfavoriting artwork api 
        app.delete('/unfavorite/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await favourtiteCollection.deleteOne(query)
            res.send(result);
        })

        //! Added artwork api
        app.post('/addartwork', async (req, res) => {
            const data = req.body;
            const result = await artworkCollection.insertOne(data)
            res.send(result);
        })

        //! my gallery get api 
        app.get('/mygallery', async (req, res) => {
            const query = req.query.email;
            const result = await artworkCollection.find({ email: query }).toArray();
            res.send(result)
        })

        //! My Gallery delete api 
        app.delete('/mygalleryDetele/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await artworkCollection.deleteOne(query)
            res.send(result)
        })

        //! get data for update my gallery 
        app.get('/updateGellary/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artworkCollection.findOne(query)
            res.send(result)
        })

        //! My Gallery update api 
        app.patch('/updateMyGallery/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    ...data
                }
            }

            const result = await artworkCollection.updateOne(query, update)
            res.send(result)
        })

        //! get all category 
        app.get('/categorys', async (req, res) => {
            try {
                const result = await artworkCollection.distinct('category')
                res.send(result)
            }
            catch (error) {
                console.error('Error:', error) // এখন error দেখতে পাবেন
                res.status(500).send({ error: error.message })
            }
        })
        
        //! filter by category api
        app.get('/category', async (req, res) => {
            const category = req.query.category;
            const result = await artworkCollection.find({ category: { $regex: category, $options: 'i' } }).toArray();
            res.send(result);
        })

        //! get total artwork 
        app.get('/totalArt',async(req,res) => {
            const email = req.query.email;
            const result = await artworkCollection.find({email,artist_info_total_artworks: { $exists: true }}).toArray()
            res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
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