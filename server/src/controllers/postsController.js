const { PrismaClient, FollowRequestStatus } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const includeFollowing = req.query.isFollowingPostsInclude === "true";

    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: includeFollowing
            ? [
                currentUserId,
                ...(await prisma.userFollow
                  .findMany({
                    where: {
                      followerId: currentUserId,
                      status: FollowRequestStatus.ACCEPTED,
                    },
                    select: {
                      followingId: true,
                    },
                  })
                  .then((following) => following.map((f) => f.followingId))),
              ]
            : [currentUserId],
        },
      },
      include: {
        author: {
          select: {
            username: true,
            profilePicture: true,
            gender: true,
          },
        },

        comments: { include: { author: true }, 
        orderBy: { createdAt: "desc" } },
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ error: "Title, content and user are required" });
    }
    const newPost = await prisma.post.upsert({
      where: {
        title,
      },
      update: {},
      create: {
        title,
        content,
        authorId,
      },
    });

    if (newPost.authorId !== authorId || newPost.content !== content) {
      return res.status(400).json({
        error: `A post titled "${title}" already exists. Please use a different title.`,
      });
    }
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error while creating post" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { id: userId, isAdmin } = req.user;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You are no authorized to delete this post" });
    }
    await prisma.like.deleteMany({
      where: { postId },
    });

    await prisma.comment.deleteMany({
      where: { postId },
    });

    await prisma.post.delete({
      where: { id: postId },
    });

    res.json({ message: "Post successfully deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error while deleting post" });
  }
};
