const express = require('express')
const app  = express()
const Router = require('./Routes')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.listen(8000, ()=> console.log("server started"))
app.use("/",Router)
