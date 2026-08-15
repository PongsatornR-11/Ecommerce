import React, { useState, useEffect } from "react";
import useEcomStore from "../store/ecom-store";
import { currentUser } from "../api/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectRouteUser = ({ element }) => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      currentUser()
        .then(() => {
          setOk(true);
        })
        .catch(() => {
          setOk(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setOk(false);
      setLoading(false);
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return ok ? element : <LoadingToRedirect />;
};

export default ProtectRouteUser;
