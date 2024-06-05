import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Vinayan from "../../../images/vinayan-logo.png";
import axios from "axios";

const SignUp = () => {
  const router = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    retryPassword: "",
    role: "",
    phNumber: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    retryPassword: "",
    role: "",
    phNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleApiCall = async (udata) => {
    try {
      setIsLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        udata,
        config
      );

      if (data) {
        localStorage.setItem("token", data.token);
        toast.success("Successfully Sign Up.");
        router("/records");
      } else {
        toast.danger("Sign Up Failed");
      }

      // Navigate to the sign-in page
    } catch (error) {
      console.error("API call error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData, "formdata");

    // Validation
    const validationErrors = {
      name: "",
      email: "",
      password: "",
      retryPassword: "",
      role: "",
      phNumber: "",
    };
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      validationErrors.email = "Invalid email";
    }
    if (!formData.name) {
      validationErrors.name = "Full Name is required";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required";
    }
    if (!formData.role) {
      validationErrors.role = "Role is required";
    }

    if (!formData.phNumber) {
      validationErrors.phNumber = "Phone Number is required";
    }

    if (!formData.retryPassword) {
      validationErrors.retryPassword = "Password is required";
    } else if (formData.password !== formData.retryPassword) {
      validationErrors.retryPassword = "Password doesn`t matched please retry";
    }

    setErrors(validationErrors);

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      const data = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phNumber: formData.phNumber,
        role: formData.role,
      };

      handleApiCall(data);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  return (
    <>
      <div className=" flex items-center gap-y-5 flex-col md:py-10 justify-center bg-orange-200 h-screen">
        <div className="bg-white border-t-4 border-[#fa983d] shadow-xl rounded-xl md:min-w-[300px] z-30 px-5 py-5  flex flex-col gap-y-1">
          <span className=" flex justify-center  ">
            <img
              src={Vinayan}
              alt="Logo"
              className="object-contain flex justify-center w-32 h-12"
            />
          </span>
          <h5 className=" font-medium lg:font-normal lg:text-xl mt-1 leading-10 text-gray-700 text-center w-full">
            Welcome to Vinayan
          </h5>

          <form onSubmit={handleSubmit} className="flex flex-col  gap-2 mt-2">
            <div className="col-span-1 flex-col flex gap-y-.5">
              <label className="text-base pb-2">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                size="large"
                className="rounded border border-gray-600"
              />
              {errors.name && <p className="text-danger">{errors.name}</p>}
            </div>

            <div className=" gap-x-2">
              <div className="col-span-1 flex-col flex gap-y-.5">
                <label className="text-base   pb-2">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  size="large"
                  className="rounded border border-gray-600"
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>{" "}
            </div>
            <div className="grid grid-cols-2 gap-x-2">
              <div className="col-span-1 flex-col flex gap-y-.5">
                <label className="text-base pb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="rounded  border px-3 py-2"
                >
                  <option value="">Select Role</option>
                  <option value="software">Software</option>
                  <option value="hardware">Hardware</option>
                  <option value="others">Others</option>
                </select>
                {errors.role && <p className="text-danger">{errors.role}</p>}
              </div>

              <div className="col-span-1 flex-col flex gap-y-.5">
                <label className="text-base   pb-2">Phone Number</label>
                <Input
                  name="phNumber"
                  value={formData.phNumber}
                  onChange={handleChange}
                  size="large"
                  className="rounded border border-gray-600"
                />
                {errors.phNumber && (
                  <p className="text-danger">{errors.phNumber}</p>
                )}
              </div>
              <div className="col-span-1 flex-col flex gap-y-.5">
                <label className="text-base   pb-2">Password</label>
                <Input.Password
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  size="large"
                  className="rounded border border-gray-600"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password}</p>
                )}
              </div>
              <div className="col-span-1 flex-col flex gap-y-.5">
                <label className="text-base pb-2">Retry-Password</label>
                <Input.Password
                  name="retryPassword"
                  value={formData.retryPassword}
                  onChange={handleChange}
                  size="large"
                  className="rounded border border-gray-600"
                />
                {errors.retryPassword && (
                  <p className="text-danger">{errors.retryPassword}</p>
                )}
              </div>
            </div>

            <span className="flex justify-center mt-4">
              <button className="w-min p-1  rounded  hover:border-primary hover:text-primary bg-primary">
                <span
                  className=" gap-x-2 px-6 py-1  whitespace-nowrap flex items-center text-white"
                  onClick={(e) => {
                    handleSubmit(e);
                    router("/records");
                  }}
                >
                  Continue
                  <BsArrowRight className="w-4 h-4 " />
                </span>
              </button>
            </span>
            {/* <p className='text-center text-sm'>OR</p>*/}
            <span className="flex justify-center "></span>
            <span className="flex justify-center "></span>
            <span className=" flex justify-center text-sm text-center w-full">
              Don’t have an account?&nbsp;
              <p
                onClick={() => router("/")}
                className="text-primary w-2 px-1 hover:font-bold hover:underline cursor-pointer"
              >
                SignIn
              </p>
            </span>
          </form>
        </div>
      </div>
    </>
  );
};
export default SignUp;
