import express from 'express'

const app= express();
const Port = 3000;

app.use(express.json())

app.get('/' , (req,res) =>{
    res.json({ msg: 'Hello from server' })
})




app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!'); 
});


app.listen(Port ,() => {
    console.log(`Service running on http://localhost:${Port}`);
});

