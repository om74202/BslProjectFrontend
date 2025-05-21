import { useState, useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function AdmineRoute() {
  const [ok, setOk] = useState(false);
  const [authUser, setAuthUser] = AuthProvider();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("/api/v1/user/admin-auth");
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (authUser?.token) authCheck();
  }, [authUser?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
