import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'


const authenticateUser = async(req , res , next) => {
    const token = req.cookies?.accessToken
    if(! token) {
        // redirect to login page / signup
    }
    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    if(! decodedToken) {
        // means access token expired re-generate it using refresh token
    }
    const user = await User.findById(decodedToken._id)

    req.user = user;
    next()
}


export {
    authenticateUser,
}