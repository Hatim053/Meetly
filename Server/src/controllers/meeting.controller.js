import Meeting from "../models/meeting.model.js"
import {v4 as uuidv4} from 'uuid'


// creating meeting enpoint and returing roomId in response
const handleCreateMeeting = async (req , res) => {
      try {
        const { hostName } = req.body || 'user'
        const roomId = uuidv4()
    
        // here create meeting and store in mongodb {hostName , roomId , createdAt}
        const meeting = await Meeting.create({
        hostName,
        roomId,
        })
    
        console.log(meeting)
    
        return res
        .status(200)
        .json({
            status : 200,
            roomId,
        })
      } catch (error) {
        console.log(error)
      }
}

export {
    handleCreateMeeting,
}