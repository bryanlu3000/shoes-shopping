import { createContext, ReactNode, useContext, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { axiosInstance, axiosWithCredential } from "../hooks/useAxios";

interface Auth {
  email: string;
  password: string;
  accessToken: string;
}

interface SignProps {
  email: string;
  password: string;
  setServerErr: React.Dispatch<React.SetStateAction<string>>;
  callback: () => void;
}

interface AuthContextProps {
  auth: Auth;
  isLogin: boolean;
  signUp: (props: SignProps) => void;
  signIn: (props: SignProps) => void;
  signOut: () => void;
  refreshToken: () => Promise<string>;
  isOpen: boolean;
  openSigninModal: () => void;
  onClose: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState({} as Auth);
  const [isLogin, setIsLogin] = useSessionStorage("isLogin", false);

  const { isOpen, onOpen, onClose } = useDisclosure(); // Control SigninModal open/close
  const openSigninModal = () => onOpen(); // Try not to conflict with other onOpen function

  // Sign up
  const signUp = ({ email, password, setServerErr, callback }: SignProps) => {
    axiosInstance
      .post("/api/signup", { email, password })
      .then((res) => {
        if (res.status === 201) {
          callback();
        }
        console.log(res.data.message);
      })
      .catch((err) => {
        if (!err?.response) {
          setServerErr("No server response");
        } else if (err.response?.status == 409) {
          setServerErr("Email has already existed.");
        } else {
          setServerErr("Registration failed");
        }
      });
  };

  // Sign in (still need to receive cookie, so axios needs to withCredentials)
  const signIn = ({ email, password, setServerErr, callback }: SignProps) => {
    axiosWithCredential
      .post("/api/signin", { email, password })
      .then((res) => {
        if (res.status === 201) {
          const accessToken = res?.data?.accessToken;
          setAuth({ email, password, accessToken });
          setIsLogin(true);
          callback();
        }
        console.log(res.data.message);
      })
      .catch((err) => {
        if (!err?.response) {
          setServerErr("No server response");
        } else if (err.response?.status == 401) {
          setServerErr("Unauthorized");
        } else {
          setServerErr("Login failed");
        }
      });
  };

  // Sign out
  const signOut = () => {
    axiosWithCredential
      .get("/api/signout")
      .then((res) => {
        if (res.status === 204) {
          setAuth({} as Auth);
          setIsLogin(false);
          console.log("Logout Success");
        }
      })
      .catch((err) => console.error(err));
  };

  // Refresh accessToken
  const refreshToken = async () => {
    try {
      const res = await axiosWithCredential.get("/api/refresh");
      const accessToken = res.data.accessToken;
      setAuth((prev) => ({ ...prev, accessToken }));
      return accessToken;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        isLogin,
        signUp,
        signIn,
        signOut,
        refreshToken,
        isOpen,
        openSigninModal,
        onClose,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
