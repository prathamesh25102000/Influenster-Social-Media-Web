const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SecretKey } = require('../config/private')
const { EMAIL } = require('../config/private')

const verifytoken = require('../middleware/verifytoken')
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()

router.get('/', (req, res) => {
    res.send("Hello")
})

//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



router.post('/signup', (req, res) => {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: " already existing user with this email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name
                    })

                    user.save()
                        .then(user => {
                            //console.log("registered successfully");
                            const sender = {
                                email: 'authentication@influenster.com',
                                name: 'Influenster',
                            }
                            const receivers = [
                                {
                                    email: user.email,
                                },
                            ]

                            tranEmailApi
                                .sendTransacEmail({
                                    sender,
                                    to: receivers,
                                    subject: 'Signup successful',
                                    htmlContent: `
                    <h1>Welcome to Influenster</h1>
                    <img src="https://www.nicepng.com/png/detail/281-2811525_average-review-rating-influenster.png" >`,
                                    params: {
                                        role: 'Frontend',
                                    },
                                })
                                .then(console.log)
                                .catch(console.log)

                            res.json({ message: "registered successfully" })

                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({message:"successfully signed in"})
                        const token = jwt.sign({ _id: savedUser._id }, SecretKey)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

router.post('/reset_password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{

                const sender = {
                    email: 'authentication@influenster.com',
                    name: 'Influenster',
                }
                const receivers = [
                    {
                        email: user.email,
                    },
                ]
                //console.log(`${token}`);
                tranEmailApi
                    .sendTransacEmail({
                        sender,
                        to: receivers,
                        subject: 'Reset Password',
                        htmlContent: `<h1>You have requested to reset password</h1> 
                        <h5>Please note following link will be valid only for 1 hour to reset password<h5>
                        <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>`,
                        params: {
                            role: 'Frontend',
                        },
                    })
                    .then(console.log)
                    .catch(err=>{
                        console.log(err)})              
                res.json({message:"We have sent you a link to reset password on your registered email. Check your email"})
            })

        })
    })
})

router.post('/new_password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Session expired. Try again after some time"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"updated password successfully"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router

