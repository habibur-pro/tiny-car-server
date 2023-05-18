const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tiny-car.dnno3bv.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        const carCollection = client.db("tiny_CarDB").collection("cars")

        // operations 

        // get toys by sub_category 
        app.get('/toys', async (req, res) => {
            const category = req.query.sub_category;
            if (category) {
                const query = {
                    sub_category: category
                };

                const result = await carCollection.find(query).toArray()
                res.send(result)
            }
            else {
                const result = await carCollection.find().toArray()
                res.send(result)
            }

        })


        // get single toy by id 
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query)
            res.send(result)

        })

        // get toy by user 
        app.get('/myToys', async (req, res) => {
            const email = req.query.email;
            const filter = { seller_email: email }
            const result = await carCollection.find(filter).toArray()
            res.send(result)

        })

        // post a toy 
        app.post('/addToy', async (req, res) => {
            const car = req.body;
            const result = await carCollection.insertOne(car)
            res.send(result)

        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('tiny car server is running')
})

app.listen(port, () => {
    console.log('tiny server is running')
})
