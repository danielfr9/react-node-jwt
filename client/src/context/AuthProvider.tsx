import { createContext, useState } from "react";

type Props = {
  children?: React.ReactNode;
};

type UserData = {
  email?: string | null;
  accessToken?: string | null;
};

export const AuthContext = createContext({} as ReturnType<typeof useValue>);

const useValue = () => {
  const [auth, setAuth] = useState<UserData | undefined>();

  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist") || "false") || false
  );

  return {
    auth,
    setAuth,
    persist,
    setPersist,
  };
};

const AuthProvider = ({ children }: Props) => {
  return (
    <AuthContext.Provider value={useValue()}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
