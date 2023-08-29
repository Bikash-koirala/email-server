import React from "react";
import "./index.css";

const IconWrapper = ({ icon, title = "", wrapperClass, style, ...props }) => {
  return (
    <div
      style={{
        ...style,
        width: 24,
        height: 24,
      }}
      title={title}
      className={`${wrapperClass ? wrapperClass : ""} braintip-icon`}
      {...props}
    >
      {icon}
    </div>
  );
};

export default IconWrapper;
