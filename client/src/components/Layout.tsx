import { Link, Outlet } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";

const Layout = () => {
  const { logout } = useLogout();
  const { auth } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white relative">
      <nav className="h-14 flex items-center bg-zinc-950 sticky top-0 right-0 px-6">
        <Link className="font-semibold" to="/">
          JWT
        </Link>
        <ul className="flex space-x-10 px-8 grow justify-center">
          {auth?.accessToken && (
            <>
              <Link
                className="font-semibold underline decoration-transparent duration-200 ease-in hover:decoration-white decoration-dotted decoration-2 underline-offset-4"
                to="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="font-semibold underline decoration-transparent duration-200 ease-in hover:decoration-white decoration-dotted decoration-2 underline-offset-4"
                to="/refresh"
              >
                Refresh
              </Link>
              <Link
                className="font-semibold underline decoration-transparent duration-200 ease-in hover:decoration-white decoration-dotted decoration-2 underline-offset-4"
                to="/me"
              >
                Me
              </Link>
            </>
          )}
        </ul>
        {auth?.accessToken ? (
          <button
            className="text-red-400 font-semibold border border-red-300 py-2 px-3 rounded-lg hover:bg-red-400/20"
            onClick={() => logout()}
          >
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <Link
              className="border border-blue-800 py-2 px-3 rounded-lg font-semibold"
              to="/register"
            >
              Register
            </Link>
            <Link
              className="bg-blue-800 py-2 px-4 rounded-lg font-semibold"
              to="/login"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
