import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export default function PageNotFound({heading}) {
  let isAuthenticated = true;
  const redirectionHandler = () => {
    return (
      <>
        <Link to={isAuthenticated ? "/email" : "/"}>
          <Button type="primary">Back Home</Button>
        </Link>
      </>
    );
  };

  return (
    <>
      <div className="bg-gray-50 h-screen overflow-hidden">
        <Result
          status="404"
          title={ heading ? heading : "404"}
          subTitle={heading ? "" : "Sorry, the page you visited does not exist."}
          extra={redirectionHandler()}
        />
      </div>
    </>
  );
}
