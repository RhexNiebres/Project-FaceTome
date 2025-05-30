import { useState, useEffect } from "react";
import { sendFollowRequest, cancelFollow } from "../apiServices/followers";

const FollowButton = ({
  followingId,
  initiallyFollowed = false,
  hasCTA = false,
}) => {
  const [followed, setFollowed] = useState(initiallyFollowed);
  const [pendingRequest, setPendingRequest] = useState(hasCTA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFollowed(initiallyFollowed);
  }, [initiallyFollowed]);

  useEffect(() => {
    setPendingRequest(hasCTA);
  }, [hasCTA]);

  const handleToggleFollow = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (followed || pendingRequest) {
        result = await cancelFollow(followingId);
      } else {
        result = await sendFollowRequest(followingId);
      }

      if (result.success) {
        if (followed) setFollowed(false);
        if (pendingRequest) setPendingRequest(false);
        if (!followed && !pendingRequest) setPendingRequest(true);
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch {
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) {
      return followed || pendingRequest ? "Cancelling..." : "Following...";
    }
    if (pendingRequest) return "Cancel Request";
    if (followed) return "Cancel";
    return "Follow";
  };

  const buttonClass = loading
    ? "bg-blue-400 cursor-wait"
    : followed || pendingRequest
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleToggleFollow}
        disabled={loading}
        aria-pressed={followed}
        aria-busy={loading}
        className={`px-4 py-2 rounded-md text-white transition-all duration-200 ${buttonClass}`}
      >
        {getButtonText()}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FollowButton;
