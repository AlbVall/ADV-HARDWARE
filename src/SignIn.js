import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; 

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, username, password);
      setError("");
      navigate("/table"); 
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-800">
      <div className="flex flex-col justify-center items-center w-full lg:w-2/3 bg-customGrey p-8">
        <h2 className="text-[30px] lg:text-[50px] font-bold mb-[80px] text-center text-black">
          LOG IN TO YOUR ACCOUNT
        </h2>

        {/* EMAIL*/}
        <form className="flex flex-col w-full sm:w-[350px] lg:w-[400px]" onSubmit={handleSubmit}>
          <label htmlFor="username" className="mb-2 font-medium text-[20px] text-black">
            Email
          </label>
          <input
            type="email"
            id="username"
            className="mb-8 p-2 border-2 border-gray-300 rounded-[10px] text-[25px] bg-white w-full"
            placeholder="Enter your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

        {/* PASSWORD*/}
          <label htmlFor="password" className="mb-2 font-medium text-[20px] text-black">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="mb-10 p-2 border-2 border-gray-300 rounded-[10px] text-[24px] bg-white w-full"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-[27px] transform -translate-y-1/2 text-[20px] text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* ERROR FONT */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 mt-5 text-white py-2 rounded-[10px] w-full h-[50px] lg:w-[200px] self-center"
          >
            Sign In
          </button>
        </form>

        {/* SIGN UP */}
        <p className="mt-4 text-black">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-teal-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:w-1/3 p-5 relative">

      
  {/* Background Image with Blur */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('/bgtools.jpg')",
      filter: "blur(5px)",
    }}
  ></div>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-white opacity-5"></div>

  {/* Content */}
  <img src="/ADV%20HARDWARE.png" className="h-30 mb-6 relative" alt="logo" />
</div>





    </div>
  );
}

export default SignIn;
