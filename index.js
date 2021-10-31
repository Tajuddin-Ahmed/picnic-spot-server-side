const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmzth.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('picnicSpot');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // GET API

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        // GET DATA FOR HOME 
        app.get('/home', async (req, res) => {
            const cursor = serviceCollection.find({}).limit(4);
            console.log(cursor);
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST API 

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        });

        // GET single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });
        // DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleted id', id);
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
        // DELETE API from orderCollection
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleted id', id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
        // POST API for placing order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });
        // GET API of all orders 
        app.get('/allOrders', async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Picnic Spot Booking server is Running');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})