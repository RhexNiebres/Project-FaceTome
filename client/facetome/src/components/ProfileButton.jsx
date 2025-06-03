import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
const ProfileButton = ({ user, getAvatar }) => {
  const navigate = useNavigate();

  return user ? (
    <button
      onClick={() => navigate("/profile")}
      className="flex items-center space-x-2 bg-2 text-slate-200 px-4 py-2 rounded-md hover:bg-1 hover:text-slate-100 transition-all duration-200 shadow-sm"
    >
      <img
        src={user.profilePicture || getAvatar(user.gender)}
        alt="User avatar"
        className="w-8 h-8 rounded-full object-cover"
      />
      <span>{user.username}</span>
    </button>
  ) : (
    <div className="flex justify-center items-center p-2">
      <FontAwesomeIcon
        icon={faCircleNotch}
        spin
        className="text-blue-500 text-3xl"
      />
    </div>
  );
};

export default ProfileButton;
