import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectEmailSync } from "../../../store/email/selectors";
import "./loader.css";

const SyncLoader = () => {
  const [width, setWidth] = useState(1);

  let timer;
  useEffect(() => {
    timer = setTimeout(() => {
      setWidth(width < 50 ? width * 1.3 : width * 1.1);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [width]);

  return (
    <div className="loader-fullscreen overflow-hidden">
      <div className="inner-loader">
        <div className="progress">
          <span
            className="meter"
            style={{
              width: `${width}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SyncLoader;
