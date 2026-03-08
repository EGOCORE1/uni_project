const dotenv = require('dotenv').config() 
const express = require('express')
const connectDB = require('./config/DB')

const port = 4000
const app = express()
app.use(express)

const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server running on port ${port} &  MongoDB Connected ✅`))
    } catch (error) {
        
        console.log(error);
    }
}
start()