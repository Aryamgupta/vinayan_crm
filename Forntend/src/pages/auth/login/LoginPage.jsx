import { Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Vinayan from "../../../images/vinayan-logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import backimg from "../../images/backimg.jpg";
const Login = () => {
  const router = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleApiCall = async (udata) => {
    try {
      setIsLoading(true);
      // Simulating API call with a timeout

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        udata,
        config
      );
      if (data) {
        setIsLoading(false);
        localStorage.setItem("token", data.token);
        toast.success("Login successful");
        router("/records");
      } 
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
      console.error("API call error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const validationErrors = {
      email: "",
      password: "",
    };
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      validationErrors.email = "Invalid email";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      const data = {
        email: formData.email,
        password: formData.password,
      };
      console.log(data);
      handleApiCall(data);
      // Check if email and password match the hardcoded values
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-orange-200"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/03/60/64/63/360_F_360646378_zVrp1gmsEik4TArd6jY032KSDRGAKse9.jpg')",
        backgroundPosition: "bottom",
        backgroundSize: "cover",
      }}
    >
      <ToastContainer />
      {/* Your content here */}

      {!isLoading ? (
        <div className="w-full max-w-md">
          <div className="bg-white  shadow-2xl rounded-xl p-6 border-t-4 border-[#fa983d]">
            <h3 className=" font-medium text-gray-700 mb-4 text-center">
              Welcome to Vinayan
            </h3>
            <div className="flex justify-center">
              <img
                src={Vinayan} // Replace with the path to your logo image
                alt="Logo"
                className="w-24 h-20"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  size="large"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
                <Input.Password
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  size="large"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                {/* <span className="text-sm text-primary mt-1 cursor-pointer hover:font-semibold">
                  Forgot password?
                </span> */}
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white rounded py-2 mt-4 hover:bg-darkPrimary"
              >
                LOG IN
              </button>
              <p className="text-center mt-4 text-sm">
                Don’t have an account?{" "}
                <span
                  onClick={() => router("/signup")}
                  className="text-primary cursor-pointer hover:font-semibold hover:underline"
                >
                  Sign Up
                </span>
              </p>
            </form>
          </div>
        </div>
      ) : (
        <></> // You can add loader component here
      )}
    </div>
  );
};

export default Login;
