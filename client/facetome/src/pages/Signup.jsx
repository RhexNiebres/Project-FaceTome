import { useState } from "react";
import { signup } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "NON_SPECIFIED",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    const usernameRegex = /^.{7,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{8,}$/;

    if (!usernameRegex.test(credentials.username)) {
      setError("Username must be at least 7 characters long.");
      return;
    }

    if (!emailRegex.test(credentials.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(credentials.password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const data = await signup({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        gender: credentials.gender,
      });

      alert(data.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-4xl font-bold text-blue-500 mb-6">FaceTome</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={handleSignup}
          className="bg-white p-6 rounded-lg shadow-lg w-80"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create a new account
          </h2>
          <label
            htmlFor="username"
            className="block font-semibold text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="email" className="block font-semibold text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="password"
            className="block font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="confirmPassword"
            className="block font-semibold text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={credentials.confirmPassword}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                confirmPassword: e.target.value,
              })
            }
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="gender" className="block font-semibold text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            value={credentials.gender}
            onChange={(e) =>
              setCredentials({ ...credentials, gender: e.target.value })
            }
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NON_SPECIFIED">Prefer not to say</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <button
            type="submit"
            className={`w-full text-white font-semibold py-3 rounded-md hover:bg-blue-400 transition duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="flex justify-center mt-4 border-t-2">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 rounded-md p-2 font-semibold text-white mt-5 "
            >
              Already have an account?
            </button>
          </div>
          <a
            href="http://localhost:8080/auth/google"
           className="mt-4 flex items-center justify-center w-full bg-white border hover:bg-gray-200 text-gray font-semibold py-2 rounded-md transition duration-200"
          >
              <img className="w-7 h-7 mr-7" src="/google.png" alt="Google Logo" />
            Sign up with Google
          </a>
        </form>
        
      </div>
      
    </div>
  );
};

export default Signup;
