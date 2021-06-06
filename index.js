const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/washbay'
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors');


const app = express()
// cors
app.use(cors())
mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology: true, useFindAndModify: false})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(fileUpload())
app.use(express.static('./app/Files/Logo/'))
app.use(express.static('./app/Files/Qrcode/'))



// define initial route
app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to Wash-bay REST Api "
    });
});

const vehicleRoutes = require('./app/Routes/vehicle.routes');

// routes
require('./app/Routes/service.routes')(app);
require('./app/Routes/brand.routes')(app);
require('./app/Routes/company.routes')(app);
require('./app/Routes/emirate.routes')(app);
require('./app/Routes/serviceRep.routes')(app);
require('./app/Routes/order.routes')(app);
require('./app/Routes/users.routes')(app);
app.use('/vehicle', vehicleRoutes());


app.listen(3000, () => {
    console.log('Server started')
})
