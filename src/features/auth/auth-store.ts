import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type XUser = {
  isAuthenticated: boolean;
  name: string;
  avatar: string;
};

type Wallet = {
  isConnected: boolean;
  address: string;
};

interface IAuthState {
  user: XUser;
  wallet: Wallet;

  logInX: (payload: { name: string; avatar?: string }) => void;
  logOutX: () => void;

  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
}

export const useAuthStore = create<IAuthState>()(
  immer((set) => ({
    user: { isAuthenticated: false, name: "", avatar: "" },
    wallet: { isConnected: false, address: "" },

    logInX: ({ name, avatar = "" }) =>
      set((state) => {
        state.user.isAuthenticated = true;
        state.user.name = name;
        state.user.avatar = avatar;
      }),

    logOutX: () =>
      set((state) => {
        // logout X
        state.user.isAuthenticated = false;
        state.user.name = "";
        state.user.avatar = "";

        // enforce invariant: wallet cannot exist without user
        state.wallet.isConnected = false;
        state.wallet.address = "";
      }),

    connectWallet: (address: string) => {
      set((state) => {
        state.wallet.isConnected = true;
        state.wallet.address = address;
      });
    },

    disconnectWallet: () =>
      set((state) => {
        state.wallet.isConnected = false;
        state.wallet.address = "";
      }),
  })),
);
