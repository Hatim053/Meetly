import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'


const options = {
    httpOnly : true,
    secure : true,
}

const generateAccessAndRefreshToken = async(user) => {
const refreshToken = user.generateRefreshToken()
const accessToken = user.generateAccessToken()
user.refreshToken = refreshToken
await user.save({ validateBeforeSave : false })
return { refreshToken , accessToken }
}


const handleUserLogin = async(req , res) => {
const { email , password } = req.body
if(! email || ! password) {
    return res
    .status(404)
    .json({
        status : 404,
        message : 'email and password required',
    })
}

const user = await User.findOne({email : email}).select("-refreshToken -password")
if(! user) {
    // redirect to signup because no user exist in the database
}

const validatePassword = await user.isPasswordCorrect(password)
if(! validatePassword) {
    return res
    .status(404)
    .json({
        status : 404,
        message : 'wrong password entered',
    })
}

const { refreshToken , accessToken } = await generateAccessAndRefreshToken()
return res
.status(200)
.cookie('accessToken' , accessToken , options)
.cookie('refreshToken' , refreshToken , options)
.json({
    status : 200,
    message : 'user loggedIn successfully',
    user,
})

}



const handleUserSignup = async(req , res) => {
const { email , name , password } = req.body

if(! email || ! name || ! password) {
    return res.
    status(404)
    .json({
        status : 404,
        message : 'email , name and password all are required',
    })
}

const user = await User.create({
    email,
    name,
    password,
})

if(! user) {
    return res
    .status(501)
    .json({
        status : 501,
        message : 'something went wrong',
    })
}

return res
.status(201)
.json({
    status : 201,
    message : 'user registered successfully'
})

}