import express from 'express'
import dotenv from 'dotenv'
import http from 'http';
import {attachWebSocketServer} from "./ws/server.js";
import { matchesRouter } from './routes/matches.js';
dotenv.config();

const app= express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

app.use(express.json())

app.get('/' , (req,res) =>{
    res.json({ msg: 'Hello from server' })
})

app.use('/matches' ,matchesRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;


app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send('Something broke!'); 
});



server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Service running on ${baseUrl}`);
});

