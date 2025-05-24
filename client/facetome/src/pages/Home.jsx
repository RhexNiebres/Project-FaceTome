import { useState, useEffect } from "react";
import { getAllPosts } from "../apiServices/posts";
import AllPost from "../components/AllPost";
import CreatePost from "../components/CreatePost";
import NavBar from "../components/NavBar";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getAllPosts();

      if (result.success) {
        setPosts(result.posts);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handlePostCreated = async () => {
    const result = await getAllPosts();
    if (result.success) {
      setPosts(result.posts);
    }
  };

  return (
    <div className="flex flex-col bg-4 justify-center">
      <NavBar />
      <div className="flex justify-center">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
      <div className="flex justify-center">
        <AllPost posts={posts} loading={loading} />
      </div>
      
    </div>
  );
};

export default Home;
