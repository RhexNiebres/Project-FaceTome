import { useState, useEffect } from "react";
import { getAllPostsForCurrentUser  } from "../apiServices/posts";

const UserPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getAllPostsForCurrentUser ();

      if (result.success) {
        setPosts(result.posts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading Posts...</div>;

  return (
    <div>
      {posts.length === 0 ? (
        <div>No posts Yet.</div>
      ) : (
        posts.map((post) => (
          <div>
            <h2>Title: {post.title}</h2>
            <p>{post.content}</p>
            <p>{post.likes.length}</p>
            <p>{post.comments.length}</p>{/* change to just comments */}
          </div>
        ))
      )}
    </div>
  );
};

export default UserPost;
