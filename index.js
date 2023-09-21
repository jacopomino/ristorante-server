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
//signup attivita
app.put("/signup", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").findOne({nomeAttivita:info.nomeAttivita}).then(e=>{
        if(!e){
            client.db("ristoro").collection("ristoranti").insertOne(info).then(i=>{
                if(!i){
                    res.status(203).send("Non è avvenuto corretamente il procedimento")
                }else{
                    res.send(i.insertedId)
                }
            })
        }else{
            res.status(203).send("Attività già registrata")
        }
    })
})
//login attivita
app.put("/login", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").findOne({password:info.password}).then(e=>{
        if(e){
            res.send(e._id)
        }else{
            res.status(203).send("Attività non esistente, Registrati!")
        }
    })
})
//login dipendente
app.put("/dipLogin", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").findOne({nomeAttivita:info.na}).then(e=>{
        if(!e){
            res.status(203).send("Attività non esistente")
        }else{
            client.db("ristoro").collection("fattorino").findOne({nome:info.nome}).then(t=>{
                if(!t){
                    const id=new ObjectId()
                    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(e._id)},{$push:{fattorino:{id:id}}}).then(i=>{
                        if(!i){
                            res.status(203).send("Non è avvenuto corretamente il procedimento")
                        }else{
                            client.db("ristoro").collection("fattorino").insertOne({_id:id,idAttivta:e._id,nome:info.nome}).then(k=>{
                                if(!k){
                                    res.status(203).send("Non è avvenuto corretamente il procedimento")
                                }else{
                                    res.send(id)
                                }
                            })
                        }
                    })
                    
                }else{
                    res.send(t._id);
                }
            })
        }
    })
})
//stai loggato
app.put("/stayLoggedIn", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").findOne({_id:new ObjectId(info._id)}).then(i=>{
        if(!i){
            res.status(203).send("Token non valido")
        }else{
            client.db("ristoro").collection("fattorino").find({idAttivta:new ObjectId(i._id)}).toArray().then(e=>{
                let obj={attivita:i,fattorino:e}
                res.status(200).send(obj)
            })
        }
    })
})
//stai loggato dipendente
app.put("/dipStayLoggedIn", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("fattorino").findOne({_id:new ObjectId(info._id)}).then(e=>{
        if(!e){
            res.status(203).send("Token non valido")
        }else{
            client.db("ristoro").collection("ristoranti").findOne({"fattorino.id":new ObjectId(info._id)}).then(i=>{
                if(!i){
                    res.status(203).send("Token non valido")
                }else{
                    let obj={attivita:i,fattorino:e}
                    res.status(200).send(obj)
                }
            }) 
        }
    })
})
//add elemento in dispensa
app.put("/add-dispensa", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$push:{"dispensa":{id:new ObjectId(),elemento:info.elemento,categoria:info.categoria}}},(err,result)=>{
        if (err) throw err;
    })
})
//modify elemento in dispensa
app.put("/modify-dispensa", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id),"dispensa.id":new ObjectId(info.idDispensa)},{$set:{"dispensa.$.quantita":info.quantita}},(err,result)=>{
        if (err) throw err;
    })
})
//add cart
app.put("/add-cart", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$push:{carrello:{id:new ObjectId(info.idCarrello),elemento:info.elemento}}},(err,result)=>{
        if (err) throw err;
    })
})
//modify elemento in cart
app.put("/modify-carrello", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id),"carrello.id":new ObjectId(info.idCarrello)},{$set:{"carrello.$.quantita":info.quantita}},(err,result)=>{
        if (err) throw err;
    })
})
//cancella elemento dal carrello
app.put("/delate-cart", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$pull:{carrello:{id:new ObjectId(info.idCarrello)}}},(err,result)=>{
        if (err) throw err;
    })
})
//add consegna
app.put("/add-consegna", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    if(info.via!==""&&info.citta!==""&&info.citofono!==""&&info.prezzo!==""&&info.ora!==""&&info.ordine!==""){
        let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
        client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$push:{consegna:{id:new ObjectId(),ora:info.ora,data:info.data,via:info.via,citta:info.citta,prezzo:parseFloat(info.prezzo),stato:0,citofono:info.citofono,ordine:info.ordine}}}).then(e=>{
            if(!e){
                res.status(203).send("Non è avvenuto corretamente il procedimento")
            }else{
                res.send("Ok")
            }
        })
    }else{
        res.status(203).send("Attenzione! Compila tutti i campi")
    }
})
//modify consegna
app.put("/modify-consegna", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id),"consegna.id":new ObjectId(info.idConsegna)},{$set:{"consegna.$.stato":info.stato,"consegna.$.fattorino":new ObjectId(info.fattorino)}}).then(e=>{
        if(!e){
            res.status(203).send("Non è avvenuto corretamente il procedimento")
        }else{
            if(info.stato===2){
                client.db("ristoro").collection("fattorino").updateOne({_id:new ObjectId(info.fattorino)},{$push:{consegna:{id:new ObjectId(info.idConsegna),stato:info.stato}}}).then((i=>{
                    if(!i){
                        res.status(203).send("Non è avvenuto corretamente il procedimento")
                    }else{
                        res.send("Ok")
                    }
                }))
            }else{
                client.db("ristoro").collection("fattorino").updateOne({_id:new ObjectId(info.fattorino),"consegna.id":new ObjectId(info.idConsegna)},{$set:{"consegna.$.stato":info.stato,"consegna.$.fattorino":info.fattorino}}).then((i=>{
                    if(!i){
                        res.status(203).send("Non è avvenuto corretamente il procedimento")
                    }else{
                        res.send("Ok")
                    }
                }))
            }
            
        }
    })
})
//cancella elemento da consegna
app.put("/delate-consegna", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$pull:{consegna:{id:new ObjectId(info.idConsegna)}}}).then(e=>{
        if(!e){
            res.status(203).send("Non è avvenuto corretamente il procedimento")
        }else{
            res.send("Ok")
        }
    })
})
//add prenotazione
app.put("/add-prenotazione", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$push:{prenotazione:{id:new ObjectId(),title:info.text,date:info.dataOra}}},(err,result)=>{
        if (err) throw err;
    })
})
//cancella prenotazione
app.put("/delate-prenotazione", async (req,res)=>{
    let info=JSON.parse(Object.keys(req.body)[0]);
    let client=new MongoClient("mongodb://apo:jac2001min@cluster0-shard-00-00.pdunp.mongodb.net:27017,cluster0-shard-00-01.pdunp.mongodb.net:27017,cluster0-shard-00-02.pdunp.mongodb.net:27017/?ssl=true&replicaSet=atlas-me2tz8-shard-0&authSource=admin&retryWrites=true&w=majority")
    client.db("ristoro").collection("ristoranti").updateOne({_id:new ObjectId(info.id)},{$pull:{prenotazione:{id:new ObjectId(info.idPrenotazione)}}},(err,result)=>{
        if (err) throw err;
    })
})