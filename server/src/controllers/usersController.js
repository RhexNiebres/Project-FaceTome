const { PrismaClient, Prisma } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const [following, followers] = await Promise.all([
      prisma.userFollow.findMany({
        where: {
          followerId: userId,
          status: {
            in: [
              Prisma.FollowRequestStatus.PENDING,
              Prisma.FollowRequestStatus.ACCEPTED,
            ],
          },
        },
        include: {
          following: true,
        },
      }),
      prisma.userFollow.findMany({
        where: {
          followingId: userId,
          status: {
            in: [
              Prisma.FollowRequestStatus.PENDING,
              Prisma.FollowRequestStatus.ACCEPTED,
            ],
          },
        },
        include: {
          follower: true,
        },
      }),
    ]);

    const usersMap = new Map();

    const formatUser = (user, status) => ({
      username: user.username,
      profilePicture: user.profilePicture,
      followStatus: status,
    });
    for (const f of following) {
      usersMap.set(f.following.id, formatUser(f.following, f.status));
    }

    for (const f of followers) {
      if (!usersMap.has(f.follower.id)) {
        usersMap.set(f.follower.id, formatUser(f.follower, f.status));
      }
    }

    const Users = Array.from(usersMap.values());

    res.status(200).json(Users);
  } catch (err) {
    console.message("Failed to fetch users:", err);
    res.status(500).json({ error: "Failed to fetch users." });
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
  const { id: userId, isAdmin } = req.user;
  try {
    if (parseInt(id) !== userId && !isAdmin) {
    return res.status(403).json({ error: "You are not authorized to update this user" });
  }
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
