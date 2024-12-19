import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, birthdate, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        name,
        birthdate,
        email,
      });

      alert("Account created successfully!");
      navigate("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Section: Form */}
      <div className="flex-1 bg-customGrey flex flex-col justify-center items-center p-8">
        <h1 className="text-[50px] font-bold text-black mb-6">CREATE YOUR ACCOUNT</h1>
        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-black font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 text-[25px] focus:ring-teal-500"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Birthdate Field */}
          <div className="flex flex-col">
            <label htmlFor="birthdate" className="text-black font-medium mb-1">
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 text-[25px] focus:ring-teal-500"
              value={formData.birthdate}
              onChange={handleInputChange}
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-black font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 text-[25px] focus:ring-teal-500"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-black font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 text-[25px] focus:ring-teal-500"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-black font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 text-[25px] focus:ring-teal-500"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          {/* Display Errors */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-md text-[25px] hover:bg-teal-700"
          >
            Sign up
          </button>
        </form>

        {/* Redirect to Sign In */}
        <p className="mt-4 text-[20px] text-black">
          Already have an account?{" "}
          <Link to="/" className="text-teal-600 text-[20px] hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* Right Section: Logo */}
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

  {/* Logo */}
  <img src="/ADV%20HARDWARE.png" className="h-30 mb-6 relative z-10" alt="logo" />
</div>

    </div>
  );
};

export default SignUp;
