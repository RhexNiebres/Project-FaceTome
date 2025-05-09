const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.likePost = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: "Post already liked" });
    }

    const like = await prisma.like.create({
      data: { userId, postId },
    });

    res.status(201).json(like); 
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ error: "Server error while liking post" });
  }
}; 


exports.unlikePost = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return res.status(400).json({ error: "Post not liked yet" });
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    res.json({ message: "Post unliked" });
  } catch (err) {
    console.error("Error unliking post:", err);
    res.status(500).json({ error: "Server error while unliking post" });
  }
};

