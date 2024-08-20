import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { API } from "../constant";
import { setToken } from "../helpers";
import { message } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type UserInputs = {
  username: string;
  email: string;
  password: string;
  cpassword: string;
};

const SignUp = () => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [viewConfirmPassword, setViewConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const { setUser } = useAuthContext();

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputs>();

  const onSubmit: SubmitHandler<UserInputs> = async (data, event) => {
    event?.preventDefault();
    try {
      const userData = new FormData();
      userData.append("username", data.username);
      userData.append("email", data.email);
      userData.append("password", data.password);
      const value = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      //   console.log(data.email);
      const response = await fetch(`${API}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const result = await response.json();
      if (result?.error) {
        setError(result.error?.message);
        throw result?.error;
      } else {
        // set the token
        setToken(result.jwt);

        // set the user
        setUser(result.user);

        message.success(`Welcome to your chats: ${result.user.username}!`);

        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-y-auto flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/chat.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <div className="text-red-600 flex justify-center">{error}</div>
          )}
          <form
            action="handle"
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  //   id="username"
                  //   name="username"
                  //   type="text"
                  //   required
                  //   autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.username && (
                  <p className="text-red-600" role="alert">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  {...register("email", { required: "Email is required" })}
                  //   id="email"
                  //   name="email"
                  type="email"
                  //   required
                  //   autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                        message:
                          "Password must be at least 6 characters long, contain 1 uppercase letter, 1 number, and 1 symbol",
                      },
                    })}
                    //   id="password"
                    //   name="password"
                    type={viewPassword ? "text" : "password"}
                    //   required
                    //   autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span
                    className="absolute right-3 top-2 cursor-pointer"
                    onClick={() => setViewPassword(!viewPassword)}
                  >
                    {viewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="cpassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <input
                    {...register("cpassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    })}
                    //   id="c-password"
                    //   name="cpassword"
                    type={viewConfirmPassword ? "text" : "password"}
                    //   required
                    //   autoComplete="confirm-password"
                    className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <span
                    className="absolute right-3 top-2 cursor-pointer"
                    onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                  >
                    {viewConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.cpassword && (
                  <p className="text-red-600" role="alert">
                    {errors.cpassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already an account?{" "}
            <Link
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              to="/signin"
              replace={true}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
