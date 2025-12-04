import express, { urlencoded } from 'express'
import http from 'http'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import meetingRoutes from './src/routes/meeting.routes.js'


const app = express()
app.use(cookieParser())
app.use(express.json({ limit : '50mb' }))
app.use(urlencoded({ limit : '50mb' , extended : true }))
app.use(cors({
    origin : `${process.env.CLIENT_SIDE_URL}`,
    methods : ['GET' , 'POST'],
    credentials : true
}))



const server = http.createServer(app)

app.use('/meetly' , meetingRoutes)

// testing route
app.get('/' , (req , res) => res.send('WebRTC signalling server is running'))


export default server