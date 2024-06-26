const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/washbay'
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors');

require('dotenv').load();

const constants = require('./config/constants')
const app = express()
// cors
app.use(cors())
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})


// app.use(bodyParser.json({limit: '50mb'}))
// app.use(bodyParser.urlencoded({
//     limit: '50mb',
//     extended: false,
// }))
// app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'true', limit: '50mb' })); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '100mb' })); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(fileUpload())
app.use(express.static('./app/Files/Logo/'))
app.use(express.static('./app/Files/Qrcode/'))
app.use('/Uploads', express.static('Uploads'));


// define initial route
app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to Wash-bay REST Api "
    });
});

const vehicleRoutes = require('./app/Routes/vehicle.routes');
const customerTypeRoutes = require('./app/Routes/customer-types.routes');
const {config} = require("dotenv");

// routes
require('./app/Routes/service.routes')(app);
require('./app/Routes/brand.routes')(app);
require('./app/Routes/company.routes')(app);
require('./app/Routes/customer.routes')(app);
require('./app/Routes/emirate.routes')(app);
require('./app/Routes/serviceRep.routes')(app);
require('./app/Routes/order.routes')(app);
require('./app/Routes/users.routes')(app);
app.use('/vehicle', vehicleRoutes());
app.use('/customer-type', customerTypeRoutes());


const port = constants.COMMON.PORT

app.listen(port, () => {
    console.log('Server started on ' + port)
})
