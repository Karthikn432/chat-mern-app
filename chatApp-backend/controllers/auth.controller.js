import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        console.log({res : fullName, username, password, confirmPassword, gender})
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: "Password didn't Match "
            })
        }

        const user = await User.findOne({ username })

        if (user) {
            return res.status(400).json({
                success: false, "errors": [
                    {
                        "name": "username",
                        "message": "username already exists"
                    }
                ]
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;   // '/assets/boy.jpg';
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`  // '/assets/girl.jpg';

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            await generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                gender: newUser.gender,
                profilePic: newUser.profilePic,

            })
            console.log("signupUser")
        } else {
            res.status(400).json({
                error: "Invalid User Data"
            })
        }


    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {

        const { username, password } = req.body;
        console.log({sign : username, password })
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            res.status(400).json({
                success: false, "errors": [
                    {
                        "name": "password",
                        "message": "Invalid username or password"
                    }
                ]
            })
        }
        console.log({ user })
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            gender: user.gender,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            message: "Logged out Successfully"
        })
        console.log("LogoutUser")
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}