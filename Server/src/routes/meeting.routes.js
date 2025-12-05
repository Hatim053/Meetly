import { Router } from "express"
import { handleCreateMeeting } from '../controllers/meeting.controller.js'
import { authenticateUser } from '../middlewares/authentication.js'
const meetingRoutes = Router()

meetingRoutes.post('/create-meeting' , authenticateUser , handleCreateMeeting)

export default meetingRoutes