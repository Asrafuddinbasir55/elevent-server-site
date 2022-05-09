const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000 ;
require('dotenv').config()

const app = express()

//middleware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://dbuser3:FbYlScI2pNtGpFw0@cluster0.ukgei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function run() {
  try {
    await client.connect();
    console.log('db connect');
    const productCollection = client.db('smartphone').collection('product');
     const productCollection2 = client.db('smartphone').collection('product2');
    

    app.get('/product', async (req, res)=>{
   const query = {};
    const cursor = productCollection.find(query);
    const product = await cursor.toArray();
    res.send(product)
    })

    app.get('/product2', async(req, res)=>{
   const query = {};
    const cursor = productCollection2.find(query);
    const product2 = await cursor.toArray();
    res.send(product2)

    })

  //   Update
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
  });
  
  app.put('/product/:id', async(req, res) =>{
    const id = req.params.id;
    const update = req.body;
    const filter = {_id: ObjectId(id)};
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
          SupplierName : update.SupplierName,
          description:update.description,
          quantity : update.quantity,
          price : update.price,
          picture : update.picture,
          Brand : update.Brand
        }
    };
    const result = await productCollection.updateOne(filter, updatedDoc, options);
    

 })
  
//  addItems

    app.post("/product", async(req, res)=>{
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })

    Delete
    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    })

  } finally {
    
  }
 }
 run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server code Running!')
})

app.listen(port, () => {
  console.log('Listening to port', port);
})