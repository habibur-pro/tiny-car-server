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
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect((err) => {
            if (err) {
                console.log(err)
                return;
            }
        });
        const carCollection = client.db("tiny_CarDB").collection("cars")

        // operations 


        // get all toys 
        app.get('/toys', async (req, res) => {
            const limit = parseInt(req.query.limit) || 0
            const result = await carCollection.find().limit(limit).toArray()
            res.send(result)

        })

        // get toys by email 
        app.get('/myToys/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { seller_email: email }
            const result = await carCollection.find(filter).toArray()
            res.send(result)
        })

        // get toys by sub_category and user 
        app.get('/allToys/:sub_category', async (req, res) => {
            const category = req.params.sub_category;
            const query = { sub_category: category };
            const result = await carCollection.find(query).toArray()
            res.send(result)

        })

        // get data by search 
        app.get('/search', async (req, res) => {
            const searchQuery = req.query.q
            filter = {
                name: {
                    $regex: searchQuery,
                    $options: 'i'
                }
            }

            const result = await carCollection.find(filter).toArray()
            res.send(result)
        })




        // get single toy by id 
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query)
            res.send(result)

        })




        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    price: updateInfo.price,
                    quantity: updateInfo.quantity,
                    description: updateInfo.description
                }
            }
            const result = await carCollection.updateOne(filter, updateDoc)
            res.send(result)

        })

        // delete a toy 
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.deleteOne(query)
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
