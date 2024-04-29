const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.2rn0dld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const craftCollection = client.db('craftDB').collection('crafts')
        const artCategoryCollection = client.db('artCategoriesDB').collection('artCategories')

        app.get('/Craft_Item', async(req, res)=>{
            const cursor = craftCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/art_category', async(req, res)=>{
            const cursor = artCategoryCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        

        app.get('/all_craft', async(req, res)=>{
            const cursor = craftCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/update_craft/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await craftCollection.findOne(query)
            res.send(result)
        })

        app.get('/my_art/:email', async(req, res)=>{
            const email = req.params.email
            const cursor = craftCollection.find({email: email})
            const result = await cursor.toArray()
            res.send(result)

        })

        app.put('/update_craft/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true}
            const updateCraft = req.body
            const craft = {
                $set: {
                    item_name: updateCraft.item_name,
                    subcategory_Name: updateCraft.subcategory_Name,
                    short_description: updateCraft.short_description,
                    price: updateCraft.price,
                    rating: updateCraft.rating,
                    processing_time: updateCraft.processing_time,
                    customization: updateCraft.customization,
                    stockStatus: updateCraft.stockStatus,
                    image: updateCraft.image 
                }
            }
            const result = await craftCollection.updateOne(filter, craft, options)
            res.send(result)
        })

        app.delete('/my_art/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await craftCollection.deleteOne(query)
            res.send(result)
        })
       
        app.post('/Craft_Item', async(req, res) => {
            const craft = req.body
            console.log(craft)
            const result = await craftCollection.insertOne(craft)
            res.send(result)

        })

        app.post('/art_category', async(req, res)=>{
            const art = req.body
            console.log(art)
            const result = await artCategoryCollection.insertOne(art)
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
    res.send('PAINTING-PROS-SERVER IS RUNNING')
})

app.listen(port, (req, res) => {
    console.log(`PAINTING PROS Server is Running on ${port}`)
})