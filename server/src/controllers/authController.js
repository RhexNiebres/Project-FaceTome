const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const { generateToken } = require("../middlewares/verifyToken");
require("dotenv").config({ path: "../../.env" });

exports.postSignUp = async (req, res, next) => {
  try {
    const { username, email, password, gender } = req.body;

    if (!username || !password || !email || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists." });
      }

      if (existingUser.email === email)
        return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        gender,
      },
    });

    const token = generateToken(newUser);
    res
      .status(201)
      .json({ message: "Account Created Successfully! Please log in.", token });
  } catch (err) {
    return next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        gender: true,
      },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      userId: user.id,
      username: user.username,
      email: user.email,
      gender: user.gender,
    });
  } catch (err) {
    next(err);
  }
};
