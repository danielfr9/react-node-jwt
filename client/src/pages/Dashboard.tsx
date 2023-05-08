import { useEffect, useState } from "react";
import axios from "../api/axios";

const Dashboard = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchFromServer = async () => {
      try {
        const response = await axios.get("/", {
          signal: controller.signal,
        });

        if (isMounted) setMessage(response.data.message);
      } catch (error) {
        console.log(error);
        setMessage("Couldn't connect to the server!");
      }
    };
    fetchFromServer();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="grow grid place-content-center">
      <div className="bg-zinc-900 w-full max-w-lg p-8 rounded-lg">
        <h1 className="text-blue-500 text-xl font-bold">{message}</h1>
      </div>
    </div>
  );
};

export default Dashboard;
