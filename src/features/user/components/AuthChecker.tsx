import { Spin } from "antd";
import React, { JSXElementConstructor } from "react";
import { Redirect, useHistory, useLocation } from "react-router";
import { useLoginMutation } from "../../../app/services/tripsApi";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { selectIsAdmin, selectIsAuth, setUserCredentials } from "../userSlice";

export default function AuthChecker(
  Component: JSXElementConstructor<any>,
  isAdminOnly: boolean
) {
  function CheckUserAuthentication(componentProps: any) {
    const isAuth = useAppSelector(selectIsAuth);
    const isAdmin = useAppSelector(selectIsAdmin);
    const [login, { isUninitialized }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const history = useHistory();
    const publicPaths = ["/login", "/register"];
    const token = localStorage.getItem("token");
    async function loginInit() {
      login({ username: "", password: "" })
        .unwrap()
        .then(({ accessToken, accessTokenExpiration, userDetails }) => {
          dispatch(setUserCredentials({ details: userDetails, accessToken }));
        })
        .catch((error) => {
          console.log(`error`, error);
          history.push("/login");
        });
    }
    if (token && !isAuth && isUninitialized) {
      loginInit();
      return <Spin />;
    } else if (token && !isAuth && !isUninitialized) {
      return <Spin />;
    } else {
      if (isAuth && !isAdmin && isAdminOnly) return <Redirect to="/" />;
      if (isAuth && pathname === "/login") return <Redirect to="/" />;
      else if (!isAuth && !publicPaths.includes(pathname))
        return <Redirect to="/login" />;
      else {
        return <Component {...componentProps} />;
      }
    }
  }

  return CheckUserAuthentication;
}
