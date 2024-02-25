import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/User.js";

export const forgetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ mail: req.body.email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: "10m",});

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD_APP_EMAIL,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Reset Password",
            html: `<h1>Reset Your Password</h1>
                    <p>Click on the following link to reset your password:</p>
                    <a href="http://localhost:3000/reset-password/${token}">http://localhost:3000/reset-password/${token}</a>
                    <p>The link will expire in 10 minutes.</p>
                    <p>If you didn't request a password reset, please ignore this email.</p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            res.status(200).send({ message: "Email sent" });
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const decodedToken = jwt.verify(
            req.params.token,
            process.env.JWT_SECRET
        );

        if (!decodedToken) {
            return res.status(401).send({ message: "Invalid token" });
        }

        const user = await User.findOne({ _id: decodedToken.userId });
        if (!user) {
            return res.status(401).send({ message: "no user found" });
        }

        const salt = await bycrypt.genSalt(10);
        req.body.newPassword = await bycrypt.hash(req.body.newPassword, salt);

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).send({ message: "Password updated" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};