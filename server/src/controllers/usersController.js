const { PrismaClient, FollowRequestStatus } = require("../generated/prisma");
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
        id: {
          not: currentUserId,
        },
      },
      select: {
        id: true,
        username: true,
        profilePicture: true,
        followers: {
          where: {
            followingId: currentUserId,
          },
          select: {
            status: true,
          },
        },
        following: {
          where: {
            followerId: currentUserId,
          },
          select: {
            status: true,
          },
        },
      },
    });

    const response = users.map((user) => {
      const follower = user.followers[0];
      const following = user.following[0];

      const canFollow =
        !follower || follower.status === FollowRequestStatus.PENDING;
      const isPendingRequest =
        follower?.status === FollowRequestStatus.PENDING;
      const isFollowing =
        follower?.status === FollowRequestStatus.ACCEPTED;
      const isFollowingEachOther =
        follower?.status === FollowRequestStatus.ACCEPTED &&
        following?.status === FollowRequestStatus.ACCEPTED;
      const hasCTA = following?.status === FollowRequestStatus.PENDING;

      return {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture,
        isFollowing,
        isPendingRequest,
        isFollowingEachOther,
        canFollow,
        hasCTA,
      };
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return res.status(500).json({ error: "Failed to fetch users." });
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
      return res
        .status(403)
        .json({ error: "You are not authorized to update this user" });
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
