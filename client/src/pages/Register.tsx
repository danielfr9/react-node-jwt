import { useState } from "react";
import axios from "../api/axios";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 ||
      confirmPassword !== password
    ) {
      alert("Invalid inputs");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post("/auth/register", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      console.log(response.data);
      navigate("/me");
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.status);
        console.error(error.response);
      } else {
        console.error(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col grow bg-zinc-950 text-white">
      <div className="flex flex-col grow items-center justify-center my-8 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 w-full max-w-xl p-8 rounded-lg space-y-5"
        >
          <h1 className="text-blue-500 text-2xl font-bold text-center">
            Register
          </h1>
          <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-4">
            <div className="flex flex-col w-full">
              <label className="italic mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                className="rounded-md p-2 bg-gray-600/30"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="italic mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                className="rounded-md p-2 bg-gray-600/30"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label className="italic mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="rounded-md p-2 bg-gray-600/30"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="italic mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="rounded-md p-2 bg-gray-600/30"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="italic mb-1" htmlFor="check-password">
              Check Password
            </label>
            <input
              id="check-password"
              className="rounded-md p-2 bg-gray-600/30"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
          </div>
          <button
            disabled={isProcessing}
            className="bg-blue-900 hover:bg-blue-800 p-2 rounded-lg w-full font-semibold"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
