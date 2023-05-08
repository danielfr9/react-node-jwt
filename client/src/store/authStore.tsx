import { create } from "zustand";

type UserData = {
  email?: string | null;
  accessToken?: string | null;
};

type AuthState = {
  auth?: UserData;
  setAuth: (by: UserData) => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  auth: undefined,
  setAuth: (by) => set((state) => ({ auth: { ...state.auth, by } })),
}));

export default useAuthStore;
