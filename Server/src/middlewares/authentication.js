import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'


const authenticateUser = async(req , res , next) => {
    const token = req.cookies?.accessToken
    console.log(token)
    if(! token) {
        // redirect to login page / signup
        console.log('no token was found redirect to login page')
    }
    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    if(! decodedToken) {
        // means access token expired re-generate it using refresh token
        console.log('acess token expired')
    }
    const user = await User.findById(decodedToken._id)

    req.user = user;
    next()
}


export {
    authenticateUser,
}