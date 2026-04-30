import { sendEmail } from "../services/mail.service.js"
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"



export const registerController = async (req, res) => {

    const { username, email, password } = req.body

    const isUserExist = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserExist) {
        return res.status(400).json({
            message: "User already exists",
            success: false,
        })

    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const emailVarificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET)

    await sendEmail({
        to: `${email}`,
        subject: "Email Verification",
        text: "Please verify your email address",
        html: `
            <h1>Welcome to our app, ${username}!</h1>
            <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVarificationToken}">Verify Email</a>
        `
    })

    return res.status(201).json({
        message: "User registered successfully. Please check your email to verify your account.",
        success: true,
        user: {
            email: user.email,
            username: user.username
        }
    })

}








export const verifyEmailController = async (req, res) => {
    const { token } = req.query

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid token"
            })
        }

        user.verified = true
        await user.save()

        const html = `
        <h1>Email Verified Successfully</h1>
        <p>Your email has been successfully verified. You can now log in to your account.</p>
        <a href="http://localhost:5173/login">Go to Login</a>
    `

        return res.send(html)
    }
    catch (error) {
        console.error("Email verification error:", error)
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message
        })
    }
}








export const loginController = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials",
            success: false
        })
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Invalid credentials",
            success: false

        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            error: "Email not verified"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token)

    return res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            email: user.email,
            username: user.username
        }
    })

}




export const getMeController = async (req, res) => {
    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user
    })
}