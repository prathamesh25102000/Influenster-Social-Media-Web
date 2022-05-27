const express=require('express')

const app=express()
const mongoose=require('mongoose')
const { MongoURI } = require('./config/private')

const port=process.env.PORT || 5000


require('./models/userSchema')
require('./models/postSchema')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
mongoose.connect(MongoURI)

mongoose.connection.on('connected',()=>{
    console.log("Connection established with MongoDB");
})

mongoose.connection.on('error',(error)=>{
    console.log(error);
})

require('./models/userSchema')
require('./models/postSchema')

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello")
})


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port,()=>{
    console.log("Server started on port 5000");
})