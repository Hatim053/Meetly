import { Router } from "express"
import { handleUserLogin , handleUserSignup ,handleUserLogout } from '../controllers/user.controller.js'
import { authenticateUser } from '../middlewares/authentication.js'

const userRoutes = Router()

userRoutes.post('/login' , handleUserLogin)
userRoutes.post('/signup' , handleUserSignup)
userRoutes.post('/logout' , authenticateUser , handleUserLogout)



export default userRoutes