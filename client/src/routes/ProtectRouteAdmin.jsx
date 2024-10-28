import React, { useState, useEffect } from "react";
import useEcomStore from "../store/ecom-store";
import { currentAdmin } from "../api/auth";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectRouteAdmin = ({ element }) => {
  const [ok, setOk] = useState(false);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);

  useEffect(() => {
    if (user && token) {
      currentAdmin(token)
        //if success run then
        .then((res) => setOk(true))
        //if fail or error run catch
        .catch((err) => setOk(false));
    }
  });

  // return if ok return element if ok == false return <LoadingToRedirect />
  return ok ? element : <LoadingToRedirect />;
};

export default ProtectRouteAdmin;
