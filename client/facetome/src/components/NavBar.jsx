import { useState } from "react";
import { getToken, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useUser } from "../provider/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  const { user, getAvatar } = useUser();
  const navigate = useNavigate();
  const token = getToken();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="bg-2 p-3 flex justify-between items-center text-white sticky top-0 z-50 shadow-md">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <h1 className="text-xl font-bold px-4">FaceTome</h1>
      </div>

    
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      <div className="hidden md:flex space-x-4 items-center">
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
          <>
            <button
              onClick={() => navigate("/community")}
              className="bg-2 p-2 rounded hover:bg-1"
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
          </>
        )}
      </div>

      {menuOpen && (
        <div className="absolute top-16 right-4 bg-2 border border-1 p-4 rounded-lg shadow-lg w-56 md:hidden z-50">
          <div className="flex flex-col space-y-2 text-sm">
            {!token ? (
              <>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/community");
                    setMenuOpen(false);
                  }}
                  className="bg-2 px-4 py-2 rounded hover:bg-1"
                >
                  Find Friends
                </button>
                <ProfileButton user={user} getAvatar={getAvatar} />
                <button
                  onClick={() => {
                    logout(navigate);
                    setMenuOpen(false);
                  }}
                  className="bg-2 px-4 py-2 rounded hover:bg-1"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
