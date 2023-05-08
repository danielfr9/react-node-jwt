import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";

const GuestOnly = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // User is logged in
    if (isMounted && auth?.accessToken) {
      navigate("/dashboard");
    }

    setIsLoading(false);

    return () => {
      isMounted = false;
      setIsLoading(false);
    };
  }, [auth?.accessToken, navigate]);

  return <>{isLoading ? <p>Guest Only Loading...</p> : <Outlet />}</>;
};

export default GuestOnly;
