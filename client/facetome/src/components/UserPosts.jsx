import { useState, useEffect } from "react";
import { getAllPostsForCurrentUser } from "../apiServices/posts";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
const UserPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getAllPostsForCurrentUser();

      if (result.success) {
        setPosts(result.posts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="text-blue-500 text-3xl"
        />
      </div>
    );

  return (
    <div className="flex flex-col  items-center gap-y-4 w-full max-w-screen-lg">
      {posts.length === 0 ? (
        <div className="font-bold">No posts Yet.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className=" p-4 w-2/3 rounded-xl text-white">
            <div className="bg-1 rounded-t text-white px-3 py-2">
              <div className="px-9">
                {/* add user profile picture here*/}
                <h3>{post.author.username}</h3>
                <h3 className="text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </h3>
              </div>
              <h2 className="px-">{post.title}</h2>
            </div>
            <div className="bg-2 rounded-b ">
              <div className="p-5 w-full bg-white text-black">
                {post.content}
              </div>

              <div className="flex justify-around">
                {/* add toggle like button here*/}
                <p>{post.likes.length}</p>
                {/* add showComments state here */}
                <p>{post.comments.length}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserPost;
