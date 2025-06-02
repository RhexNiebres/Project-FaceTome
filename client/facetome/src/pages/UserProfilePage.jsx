import { useEffect, useState } from "react";
import { getUserById } from "../apiServices/users";
import NavBar from "../components/NavBar";
import UserPost from "../components/UserPosts";
import UserProfileForm from "../components/UserProfileForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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
  }, [userId]);

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
  if (!user && !error) return <div className="flex justify-center items-center p-10 bg-4 h-screen">
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          className="text-blue-500 text-3xl"
        />
      </div>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-4 h-screen">
      <NavBar user={user} userId={userId} getAvatar={getAvatar} />
      <div className="flex ">
        <div className="flex justify-start pl-3">
          <UserProfileForm
            user={user}
            setUser={setUser}
            getAvatar={getAvatar}
          />
        </div>
        <UserPost />
      </div>
    </div>
  );
};

export default UserProfilePage;
