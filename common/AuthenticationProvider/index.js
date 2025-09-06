import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useRequest from "@/request";
import useGetContext from "../context/useGetContext";
import { getCookie } from "@/utils/get-cookie";

// const GlobalLoading = dynamic(() => import("@/components/global-loading"), {
//   ssr: false,
// });

const isBrowser = typeof window !== "undefined";

const privatePaths = [
  "/[store_id]/cart",
  "/[store_id]/checkout",
  "/[store_id]/profile",
  "/admin",
];

// const unAuthenticatedPaths = ['/login', '/signup']

const fetchProfile = async (context, profileAPI, router) => {
  const { dispatchData, AVAILABLE_ACTIONS } = context;

  const response = await profileAPI[1]();
  const { data: profileData } = response || {};

  if (Object.keys(profileData || {}).length === 0) return false;

  if (
    response.status === 200 &&
    profileData?.status === "PENDING_REGISTRATION"
  ) {
    router.push("/registration");
  }

  if (
    response.status === 200 &&
    profileData?.status !== "ADMIN" &&
    router.pathname.startsWith("/admin")
  ) {
    router.push("/");
  }

  dispatchData(AVAILABLE_ACTIONS.ADD_PROFILE, {
    ...profileData,
    isLoggedIn: true,
  });

  if (response?.status === 200) {
    return true;
  }

  return false;
};

const handleAuthentication = async (context, profileAPI, router) => {
  const token = getCookie("nk-collierville-token");

  if (!token) return false;
  const response = await fetchProfile(context, profileAPI, router);

  return response;
};

function AuthenticationProvider({ children, router }) {
  const context = useGetContext();

  const profileAPI = useRequest(
    { method: "get", url: "/auth/token-payload" },
    { manual: true }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { pathname } = router || {};

  const getLogin = async () => {
    setIsLoading(true);
    const isLogged = await handleAuthentication(context, profileAPI, router);
    setIsLoggedIn(isLogged);
    setIsLoading(false);
  };

  useEffect(() => {
    getLogin();
  }, []);

  if (!isBrowser) return null;

  // if (isBrowser && isLoading) return <GlobalLoading />;

  if (isLoading) {
    return null;
  }

  // if (isLoggedIn && unAuthenticatedPaths.includes(pathname)) {
  //   router.push('/')
  // }

  if (!isLoggedIn && privatePaths.includes(pathname)) {
    router.push("/");
  }

  if (!isLoggedIn && pathname.startsWith("/admin")) {
    router.push("/");
  }

  return children;
}

export default AuthenticationProvider;
