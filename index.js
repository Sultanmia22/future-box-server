const express = require('express')
const cors = require('cors');
const app = express();
require('dotenv').config()
const port =  process.env.PORT || 4011;

//! midleware 
app.use(cors())
app.use(express.json())




app.get('/',(req,res) => {
    res.send('Server Running...')
})

app.listen(port,() => {
    console.log('server port number = ',port)
})