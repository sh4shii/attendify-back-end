const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3030;

connectToMongo();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attend'));
app.use('/api/reviews', require('./routes/review'));

app.get('/',(req,res)=>{
    res.send('Hello Bro!');
})

app.listen(port, ()=> {
    console.log(`App listening at http://localhost:${port}`)
})
