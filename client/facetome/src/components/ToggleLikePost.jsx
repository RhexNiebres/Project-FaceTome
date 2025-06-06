import { useState } from "react";
import { toggleLikePost } from "../apiServices/like";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularHeart } from "@fortawesome/free-regular-svg-icons";

const ToggleLikePost = ({ postId, initialLiked = false, onToggle }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleLike = async () => {
    setLoading(true);
    setError(null);

    const result = await toggleLikePost(postId);

    setLoading(false);
    if (result.success) {
      const newLiked = result.like?.liked ?? !liked;
      setLiked(newLiked);
      if (onToggle) onToggle(newLiked);
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <button onClick={handleToggleLike} disabled={loading}>
         <FontAwesomeIcon
          icon={liked ? solidHeart : regularHeart}
          className={`transition-all duration-300 ease-in-out transform ${
            liked ? "text-blue-500 scale-110" : "text-gray-500 scale-100"
          }`}
        />
      </button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default ToggleLikePost;
