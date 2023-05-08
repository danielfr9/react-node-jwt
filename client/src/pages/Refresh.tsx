import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Refresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newToken, setNewToken] = useState<object | null>(null);
  const axiosPrivate = useAxiosPrivate();

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    const response = await axiosPrivate.get("/auth/refresh");

    console.log(response.data);
    setNewToken(response.data);
    setIsRefreshing(false);
  };
  return (
    <div className="flex flex-col grow bg-zinc-950 text-white p-8">
      <div className="flex justify-center w-full">
        <div className="flex flex-col max-w-lg w-full items-center bg-zinc-900 p-3 rounded-lg">
          <button
            disabled={isRefreshing}
            onClick={handleRefreshToken}
            className="bg-blue-900 hover:bg-blue-800 p-2 rounded-lg w-full font-semibold"
          >
            Refresh Token
          </button>
          {newToken && (
            <p className="my-8 break-all">
              {JSON.stringify(newToken, null, 3)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Refresh;
