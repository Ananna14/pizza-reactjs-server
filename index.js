const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json())

const port =process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojutr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("pizzaProduct");
    const serviceCollection = database.collection("services");
    const sweetCollection = database.collection("sweets")
   //GET API
   app.get('/services', async(req, res)=>{
     const cursor = serviceCollection.find({});
     const services = await cursor.toArray();
     res.send(services);
   })
    //POST api
   app.post('/services', async(req, res)=>{
     const service = req.body;
    console.log('hit the post', service)
     const result = await serviceCollection.insertOne(service);
     console.log(result)
     res.json(result)
   })
  // //  GET API SWEET
   app.get('/sweets', async(req, res)=>{
    const cursor = sweetCollection.find({});
    const sweet = await cursor.toArray();
    res.send(sweet);
  })
  //SINGLE SWEET PRODUCT
  app.get("/singleSweet/:id", async(req, res)=>{
    console.log(req.params.id)
    const sweet = await sweetCollection.find({_id: ObjectId(req.params.id)}).toArray();
    console.log(sweet);
    // res.send(sweet[0])
  })

  //   //POST sweet
   app.post('/sweets', async(req, res)=>{
     const sweet = req.body;
    console.log('hit the post', sweet)
     const result = await sweetCollection.insertOne(sweet);
     console.log(result)
     res.json(result)
     //Single product load
     
   })
   //singleProduct PIZZA
   app.get("/singleProduct/:id", async(req, res)=>{
     console.log(req.params.id)
     const result = await serviceCollection.find({_id: ObjectId(req.params.id)}).toArray();
     res.send(result[0])
   })
   app.get("/singleProduct/:id", async(req, res)=>{
     console.log(req.params.id)
     const result = await sweetCollection.find({_id: ObjectId(req.params.id)}).toArray();
     res.send(result[0])
   })
   

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
  res.send('Running react project server');
});
app.listen(port, ()=>{
  console.log('Running React project on port', port);
})