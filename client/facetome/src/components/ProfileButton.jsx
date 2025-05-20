import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../apiServices/users";

const ProfileButton = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("User not found in localStorage.");
      return;
    }

    getUserById(userId).then((res) => {
      if (res.success) {
        setUser(res.user);
      } else {
        setError(res.error || "Failed to fetch user");
      }
    });
  }, []);

  const getAvatar = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "/male.jpg";
      case "female":
        return "/female.jpg";
      default:
        return "/non_specified.jpg";
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  
  return user ? (
    <button
      onClick={() => navigate("/profile")}
      className="flex items-center space-x-2 bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 shadow-sm"
    >
      <img
        src={user.profilePicture ||getAvatar(user.gender)}
        alt="User avatar"
        className="w-8 h-8 rounded-full object-cover"
       
      />{/* fixed 429 error with loading= lazy to prevent immediate request to google*/}
      <span className=" font-bold">{user.username}</span>
    </button>
  ) : (
    <p>Loading...</p>
  );
};

export default ProfileButton;
