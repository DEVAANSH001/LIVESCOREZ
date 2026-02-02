import express from 'express'
import dotenv from 'dotenv'
import { matchesRouter } from './routes/matches.js';
dotenv.config();

const app= express();
const Port = process.env.PORT || 5000;

app.use(express.json())

app.get('/' , (req,res) =>{
    res.json({ msg: 'Hello from server' })
})

app.use('/matches' ,matchesRouter);



app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!'); 
});


app.listen(Port ,() => {
    console.log(`Service running on http://localhost:${Port}`);
});

