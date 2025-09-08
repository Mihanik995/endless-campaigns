import type {Request, Response} from "express";

declare function require(module: string): any;
const express = require('express');
const cors = require("cors");

const app = express();
app.use(cors());

app.get('/api', (req: Request, res: Response) => {
    res.status(200).json({msg: "Hello from server!"})
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});