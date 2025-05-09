const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.userFollow.findMany({
      where: {
        followingId: parseInt(userId),
        status: "PENDING",
      },
      include: {
        follower: true,
      },
    });

    res.json(followers.map((f) => f.follower));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch followers." });
  }
};

exports.getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await prisma.userFollow.findMany({
      where: {
        followerId: parseInt(userId),
        status: "ACCEPTED",
      },
      include: {
        following: true,
      },
    });

    res.json(following.map((f) => f.following));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch following." });
  }
};

exports.sendFollowRequest = async (req, res) => {
  const { followingId } = req.body;
  const followerId = req.user.id;

  if (followerId === followingId) {
    return res.status(400).json({ error: "You can't follow yourself." });
  }

  try {
    const existing = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Follow request already exists." });
    }

    const followRequest = await prisma.userFollow.create({
      data: {
        followerId,
        followingId,
        status: "PENDING",
      },
    });

    res.status(201).json(followRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.acceptFollowRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const followRequest = await prisma.userFollow.update({
      where: { id: parseInt(id) },
      data: { status: "ACCEPTED" },
    });

    res.json(followRequest);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Follow request not found." });
  }
};

exports.rejectFollowRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const followRequest = await prisma.userFollow.update({
      where: { id: parseInt(id) },
      data: { status: "REJECTED" },
    });

    res.json(followRequest);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Follow request not found." });
  }
};

exports.cancelFollow = async (req, res) => {
  const { followingId } = req.params;
  const followerId = req.user.id;

  try {
    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: parseInt(followingId),
        },
      },
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Follow request not found." });
  }
};
