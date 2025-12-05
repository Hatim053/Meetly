import mongoose from "mongoose"

const meetingSchema = new mongoose.Schema({
    roomId : {
        type : String,
        required : true,
    },
    hostName : {
        type: String,
        required : true,
    },
    hostId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    }
} , {timestamps : true})


const Meeting = mongoose.model('Meeting' , meetingSchema)


export default Meeting