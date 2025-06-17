import { useState } from "react";
import { loginAsGuest } from "../services/auth";
import { useNavigate } from "react-router-dom";

const GuestLoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      navigate("/home");
    } catch (err) {
      console.error("Guest login failed:", err.message);
      alert("Failed to log in as guest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <button
        onClick={handleGuestLogin}
        disabled={loading}
        className={`bg-4 text-white  w-full p-2 rounded hover:bg-gray-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Logging in..." : "Login as Viewer"}
      </button>
    </div>
  );
};

export default GuestLoginButton;
