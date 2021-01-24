const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/washbay'
const bodyParser = require('body-parser')


const app = express()

mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology: true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())




app.listen(9000, () => {
    console.log('Server started')
})