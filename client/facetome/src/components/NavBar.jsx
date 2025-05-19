import { getToken, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";

const NavBar = () => {
  const navigate = useNavigate();
  const token = getToken();

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center text-white">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <h1 className="text-2xl font-bold">FaceTome</h1>
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
          <div className="space-x-4 flex">
            <ProfileButton />

            <button
              onClick={() => logout(navigate)}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
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
