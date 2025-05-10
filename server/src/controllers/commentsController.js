const { PrismaClient } =require("@prisma/client");
const prisma = new PrismaClient();

exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = parseInt(req.user.id); 

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: userId, 
    },
  });

  if (!userExists) {
    return res.status(404).json({ error: 'User not found' });
  }

  const postExists = await prisma.post.findUnique({
    where:{
      id: parseInt(postId)
    }
  });

  if (!postExists) {
    return res.status(404).json({ error: 'Post not found' });
  }

  
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId), 
        authorId: userId,
      },
      include: {
        author: true, 
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

exports.deleteComment = async(req,res) =>{
    try{
        const { commentId }=req.params;
        const userId = parseInt(req.user.id); 
        
        const existingComment = await prisma.comment.findUnique({
            where: {id: parseInt(commentId)}
        });

        if(!existingComment){
            return res.status(404).json({error:'Comment does not exist'})
        }
        const user = await prisma.user.findUnique({
           where: {id:userId}
        });

        if(!user){
          return res.status(404).json({error:'User not found'})
        }
        if(existingComment.authorId !== userId && !user.isAdmin){
            return res.status(403).json({error: 'You are not authorized to delete this comment'})
        }

         await prisma.comment.delete({
            where:{id: parseInt(commentId)},
        });

        res.json({message:'comment successfully deleted'});
    }catch (error){
        console.log('Error deleting comment', error);
        res.status(500).json({error: 'Server error while deleting comment'})
    }
} 
