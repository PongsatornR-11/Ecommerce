// import

const express = require('express')
const app = express();
const morgan = require('morgan')
const { readdirSync } = require('fs')
const cors = require('cors')


// middle ware
app.use(morgan('dev'));
// for support json data 
app.use(express.json());

app.use(cors());

//import all of routes folder.
readdirSync('./routes').map((file) => app.use('/api', require('./routes/'+file)))

// step 3 router
// app.post('/api', (req,res)=>{

//     const { username,password } = req.body;
//     console.log(`username: ${username},password:${password}`);
//     res.send('Jukkru 555+')
// })



const port = 5000;
app.listen(port, ()=> console.log(`Server is running on port ${port}`))