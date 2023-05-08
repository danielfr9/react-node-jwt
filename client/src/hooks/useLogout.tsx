import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      await axiosPrivate.post("/auth/logout");
      setAuth(undefined);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return { logout };
};

export default useLogout;
