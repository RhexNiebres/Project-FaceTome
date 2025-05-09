const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
      },
      include: {
        receivedFollows: {
          where: { followerId: currentUserId },
          select: { status: true },
        },
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture, 
      followStatus: user.receivedFollows.length ? user.receivedFollows[0].status : "",
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};


exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, password, gender } = req.body;

  try {
    const existingDifferentUser = await prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [{ username }, { email }],
          },
          {
            id: {
              not: parseInt(id),
            },
          },
        ],
      },
    });

    if (existingDifferentUser) {
      return res.status(400).json({
        success: false,
        error: "Username or email already exists.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateData = {};

    if (email && email !== user.email) {
      updateData.email = email;
    }

    if (username && username !== user.username) {
      updateData.username = username;
    }
    if (gender && gender !== user.gender) {
      updateData.gender = gender;
    }

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        const hashed = await bcrypt.hash(password, 10);
        updateData.password = hashed;
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        gender: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Error updating user information" });
  }
};

