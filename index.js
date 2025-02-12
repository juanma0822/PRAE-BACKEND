const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const testRoute = require('./Routes/testRoute');


//--------------MIDDLEWARE
app.use(cors());
app.use(express.json());

//-------------ROUTES

//TEST API
app.use('/test', testRoute);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});