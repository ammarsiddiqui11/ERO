const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
JWT_SECRET="f1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3"
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://maazshaikh:12345@cluster0.ogvilvs.mongodb.net/ero", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  vehicle: {
    name: String,
    company: String,
    model: String,
  },
})

const User = mongoose.model("User", userSchema)

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
    console.log(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Registration route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, vehicle } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password, // No hashing
      vehicle,
    })

    await user.save()

    // Create and send token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" })
    res.status(201).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Login route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    console.log(user)
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and send token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" })
    console.log(token)
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Protected route example
app.get("/api/user", async (req, res) => {
  try {
    const token = req.header("x-auth-token")
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Let me know if you want me to add password hashing back later or handle passwords in a different way! 🚀
