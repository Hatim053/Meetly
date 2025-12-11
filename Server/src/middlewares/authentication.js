import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'


const authenticateUser = async(req , res , next) => {
    const token = req.cookies?.accessToken
    console.log(token)
    if(! token) { // login per redirect 
      return res
      .status(404)
      .json({
        status : 404,
        message : 'user not loggedIn',
      })
    }
    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    if(! decodedToken) {
        // means access token expired re-generate it using refresh token
        console.log('acess token expired')
        return res
        .status(404)
        .json({
            status: 404,
            message : 'token expired',
        })
    }
    const user = await User.findById(decodedToken._id)

    req.user = user;
    next()
}


export {
    authenticateUser,
}