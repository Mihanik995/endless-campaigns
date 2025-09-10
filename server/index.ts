import type {Request, Response} from "express";

const app = require('./src/config/server')
const transporter = require('./src/config/nodemailer')

const authRouter = require('./src/auth/routes')
const {verifyToken} = require('./src/auth/middleware')

app.use('/auth', authRouter)

app.get('/test', verifyToken, (req: Request, res: Response) => {
    res.status(200).send({message: 'Test passed successfully!'})
})

app.post('/send-me-email', (req: Request, res: Response) => {
    try {
        transporter.sendMail({
            from: process.env.EMAIL_HOST_USER,
            to: process.env.EMAIL_HOST_USER,
            subject: 'Hello from server!',
            text: '<h1>Hello from server!</h1>',
        })
        res.status(200).send({message: 'Message sent successfully!'})
    } catch (err) {
        res.sendStatus(500)
    }
})

app.listen(5000, () => {
    console.log("Server started on port 3000");
});