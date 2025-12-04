import { Router } from "express"
import { handleCreateMeeting } from '../controllers/meeting.controller.js'

const meetingRoutes = Router()

meetingRoutes.post('/create-meeting' , handleCreateMeeting)

export default meetingRoutes