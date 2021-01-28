const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/washbay'
const bodyParser = require('body-parser')




const app = express()

mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology: true, useFindAndModify: false})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));



// define initial route
app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to Wash-bay REST Api "
    });
});

// routes
require('./app/Routes/service.routes')(app);
require('./app/Routes/brand.routes')(app);


app.listen(9000, () => {
    console.log('Server started')
})
