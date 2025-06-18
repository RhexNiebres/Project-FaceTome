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
    <div className="fixed top-4 left-4 z-50 ">
      <div className="w-60 space-y-2">
        <button
          onClick={handleGuestLogin}
          disabled={loading}
          className={`	bg-emerald-500 text-white w-full p-2 rounded hover:bg-emerald-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login as Viewer"}
        </button>
        <p className=" text-4 font-bold text-center  w-full text-sm rounded">
          This button is for Instant demo login — no signup needed..
        </p>
      </div>
    </div>
  );
};

export default GuestLoginButton;
