import { getToken, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useUser } from "../context/UserContext";

const NavBar = () => {
  const { user, getAvatar } = useUser();
  const navigate = useNavigate();
  const token = getToken();

  return (
    <nav className="bg-2 p-1 flex justify-between items-center text-white sticky top-0 z-50">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <h1 className="text-xl font-bold px-8">FaceTome</h1>
      </div>

      <div className="space-x-4">
        {!token ? (
          <>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Log In
            </button>
          </>
        ) : (
          <div className="space-x-4 flex bg-2 text-slate-200 font-medium">
            <button
              onClick={() => navigate("/community")}
              className="bg-2 p-2 rounded hover:bg-1 "
            >
              Find Friends
            </button>
            <ProfileButton user={user} getAvatar={getAvatar} />

            <button
              onClick={() => logout(navigate)}
              className="bg-2 px-4 py-2 rounded-md hover:bg-1"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
