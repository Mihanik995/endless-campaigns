import type {Request, Response, NextFunction} from 'express';

const jwt = require('jsonwebtoken')

require('dotenv').config();

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({error: 'Access denied'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
}

module.exports = {verifyToken}