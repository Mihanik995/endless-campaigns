import type {Request, Response, NextFunction} from 'express';

declare function require(module: string): any;
const jwt = require('jsonwebtoken');

require('dotenv').config();

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({error: 'Access denied'});
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        if (!userId) return res.status(401).json({error: 'Access denied'});
        next();
    } catch (error) {
        res.status(401).json({error});
    }
}

module.exports = {verifyToken}