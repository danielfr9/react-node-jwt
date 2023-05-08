import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Me = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [me, setMe] = useState<object | null>(null);
  const axiosPrivate = useAxiosPrivate();

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    const response = await axiosPrivate.get("/me");

    console.log(response.data);
    setMe(response.data);
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
            Get Me
          </button>
          {me && <p className="my-8">{JSON.stringify(me, null, 2)}</p>}
        </div>
      </div>
    </div>
  );
};

export default Me;
