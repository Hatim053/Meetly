import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique  : true,
    },
    name : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String,
        default : null,
    }
    
} , { timestamps : true })


userSchema.pre('save' , async function() {
    if(! this.isModified('password')) return 
    this.password = await bcrypt.hash(this.password , 10)

})

// password encrypted hai that's why we can't check it direclty
userSchema.methods.isPasswordCorrect = async function(password) {
return await bcrypt.compare(password , this.password)

}



userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id : this._id,
        name : this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn : process.env.ACCESS_TOKEN_EXPIRY})
}


userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn : process.env.REFRESH_TOKEN_EXPIRY }
)
}

const User = mongoose.model('User' , userSchema)


export default User