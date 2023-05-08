import { useEffect, useState } from "react";
import axios from "../api/axios";

const Landing = () => {
  const [connection, setConnection] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const pingServer = async () => {
      try {
        const response = await axios.get("/");

        if (response.status === 200 && isMounted) setConnection(true);
      } catch (error) {
        console.log(error);
      }
    };

    pingServer();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col grow items-center p-8">
      <div className="space-y-4 max-w-lg mt-6">
        <h1 className="text-2xl font-semibold text-center">Full-stack JWT</h1>
        <p>
          This project contains a simple JWT Authentication for a website with
          React and NodeJS
        </p>
        <p>
          The backend server for this project{" "}
          <span className="italic">should</span> be running on port 4000 by
          default.
        </p>
        <p>
          Server Connection:{" "}
          {connection ? (
            <span className="text-green-500 font-semibold">Connected</span>
          ) : (
            <span className="text-red-500 font-semibold">Not Connected</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Landing;
