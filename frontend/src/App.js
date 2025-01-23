import React, { useState } from "react";
import { motion } from "framer-motion";
import { SHA256 } from "crypto-js"; // Import SHA256 from crypto-js

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", email: "", password: "" });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hash the password before sending it to the server
    const hashedPassword = SHA256(formData.password).toString();

    const dataToSend = isLogin
      ? {
          email: formData.email,
          password: hashedPassword,
        }
      : { ...formData, password: hashedPassword };

    // Replace this with an actual API call
    fetch(isLogin ? "/api/login" : "/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert(data.message || "Success!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-500">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          {isLogin ? "Welcome Back!" : "Join Us"}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {isLogin
            ? "Please login to your account."
            : "Create an account to enjoy all the features."}
        </p>
        <motion.form
          key={isLogin ? "login" : "signup"}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={formVariants}
          transition={{ duration: 0.5 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-left"
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="mt-2 w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </motion.div>
          )}
          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
          <div className="text-left">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="mt-2 w-full px-4 py-3 border rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </motion.form>
        <motion.div
          className="mt-6 text-purple-600 font-semibold cursor-pointer hover:text-purple-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleForm}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginSignup;
