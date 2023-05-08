import { useEffect, useState } from "react";
import axios from "../api/axios";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { auth, setAuth, setPersist } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    let isMounted = true;

    isMounted && auth?.accessToken && navigate(`${from}`, { replace: true });

    return () => {
      isMounted = false;
    };
  }, [auth?.accessToken, from, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.length === 0 || password.length === 0) {
      alert("Invalid inputs");
      return;
    }

    try {
      const response = await axios.post(
        "/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      localStorage.setItem("persist", JSON.stringify(rememberMe));
      setPersist(rememberMe);
      setAuth({ email: email, accessToken: response.data.accessToken });
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.status);
        console.error(error.response);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col grow bg-zinc-950 text-white">
      <div className="flex flex-col grow items-center mt-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 w-full max-w-lg p-8 rounded-lg space-y-5"
        >
          <h1 className="text-blue-500 text-2xl font-bold text-center">
            Login
          </h1>
          <div className="flex flex-col">
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
          <div className="flex flex-col">
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
          <div className="flex">
            <label htmlFor="remember-me">Remember Me</label>
            <input
              id="remember-me"
              className="order-first mr-2"
              type="checkbox"
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
            />
          </div>
          <button className="bg-blue-900 hover:bg-blue-800 p-2 rounded-lg w-full font-semibold">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
