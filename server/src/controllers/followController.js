const { PrismaClient, FollowRequestStatus} = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.userFollow.findMany({
      where: {
        followingId: parseInt(userId),
        status: {
          in: [
           FollowRequestStatus.PENDING,
            FollowRequestStatus.ACCEPTED,
          ], // to filter only the desired statuses.
        },
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
        status: {
          in: [
           FollowRequestStatus.PENDING,
           FollowRequestStatus.ACCEPTED,
          ],
        },
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
    const existingAcceptedFollow = await prisma.userFollow.findFirst({
      where: {
        status: FollowRequestStatus.ACCEPTED,
        OR: [
          { followerId, followingId },
          { followerId: followingId, followingId: followerId },
        ],
      },
    });

    if (existingAcceptedFollow) {
      return res.status(400).json({ error: "Follow relationship already exists." });
    }

    const followRequest = await prisma.userFollow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
      update: {},
      create: {
        followerId,
        followingId,
        status: FollowRequestStatus.PENDING,
      },
    });

    if (followRequest.status !== FollowRequestStatus.PENDING) {
      return res.status(400).json({ error: "Follow request already exists." });
    }
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
      data: { status: FollowRequestStatus.ACCEPTED },
    });

    const backFollow= await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followRequest.followingId,
          followingId: followRequest.followerId,
        },
      },
    });

    if (!backFollow) {
      await prisma.userFollow.create({
        data: {
          followerId: followRequest.followingId,
          followingId: followRequest.followerId,
          status: FollowRequestStatus.ACCEPTED,
        },
      });
    }

    res.json(followRequest);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Follow request was not accepted." });
  }
};


exports.rejectFollowRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const followRequest = await prisma.userFollow.update({
      where: { id: parseInt(id) },
      data: { status: FollowRequestStatus.REJECTED },
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
