const express = require("express")
const { signup,login, verifyEmail, reSignup } = require("../Controller/UserController")
const route = express.Router()

route.post("/signup",signup)
route.post("/login",login)
route.post("/verify-email",verifyEmail)
route.post("/re-signup",reSignup)

module.exports = route