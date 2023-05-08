import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, [refresh, auth?.accessToken, persist]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <p>Auth Required Loading...</p>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
