import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import {MongoClient,ObjectId} from "mongodb"

const PORT = process.env.PORT|| 3001;
const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.listen(PORT,()=>{
    console.log("run");
})
//get ristoranti
app.get("/ristoranti", async (req,res)=>{
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").find({}).toArray().then(e=>res.send(e))
})
//put signup
app.put("/signup", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").insertOne(info,(err,result)=>{
        if (err) throw err;
    })
})
//add elemento in dispensa
app.put("/add-dispensa", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$push:{dispensa:{id:new ObjectId(),elemento:info.elemento}}},(err,result)=>{
        if (err) throw err;
    })
})
//modify elemento in dispensa
app.put("/modify-dispensa", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id),"dispensa.id":new ObjectId(info.idDispensa)},{$set:{"dispensa.$.quantita":info.quantita}},(err,result)=>{
        if (err) throw err;
    })
})
//add cart
app.put("/add-cart", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$push:{carrello:{id:new ObjectId(),elemento:info.elemento}}},(err,result)=>{
        if (err) throw err;
    })
})
//modify elemento in cart
app.put("/modify-carrello", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id),"carrello.id":new ObjectId(info.idCarrello)},{$set:{"carrello.$.quantita":info.quantita}},(err,result)=>{
        if (err) throw err;
    })
})
//cancella elemento dal carrello
app.put("/delate-cart", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$pull:{carrello:{id:new ObjectId(info.idCarrello)}}},(err,result)=>{
        if (err) throw err;
    })
})
//add consegna
app.put("/add-consegna", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$push:{consegna:{id:new ObjectId(),ora:info.ora,via:info.via,citta:info.citta,prezzo:info.prezzo,stato:0}}},(err,result)=>{
        if (err) throw err;
    })
})
//modify consegna
app.put("/modify-consegna", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id),"consegna.id":new ObjectId(info.idConsegna)},{$set:{"consegna.$.stato":info.stato}},(err,result)=>{
        if (err) throw err;
    })
})
//cancella elemento da consegna
app.put("/delate-consegna", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb+srv://apo:jac2001min@cluster0.pdunp.mongodb.net/?retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$pull:{consegna:{id:new ObjectId(info.idConsegna)}}},(err,result)=>{
        if (err) throw err;
    })
})