import { notification } from "antd";
import React, { useEffect, useState } from "react";
import Mailbox from "../common/apis/Mailbox";
import Loader from "../common/components/Loader";
import { useAuth } from "../common/hooks/auth";

const Callback = () => {
  let { isAuth } = useAuth();
  const [loader, setLoader] = useState(true);

  const validateMailboxRequest = async () => {
    try {
      setLoader(true);
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const {data} =  await Mailbox.saveMailboxToken(code);
      notification.success({
        message: data || "Mailbox added successfully",
        description: "Mailbox added successfully",
        placement: "top",
      });
      // alert('Mailbox added successfully')
    } catch (error) {
      // alert(error.message);
      notification.error({
        message: error.message,
        placement: "top",
      });
      
    } finally {
      window.location.href = "/email"
      // setLoader(false);
    }
  };

  useEffect(() => {
    validateMailboxRequest();
  }, []);

  if (!isAuth) window.location.href = "/";
  if(loader) return <Loader />
  return <div>Callback</div>;
};

export default Callback;
