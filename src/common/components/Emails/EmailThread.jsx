import { Avatar, Popover, Timeline } from "antd";
import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectTheme } from "../../../store/appMode/selectors";
import { BiTimeFive } from "react-icons/bi";
import moment from "moment";

export default function EmailThread({
  mail_id,
  is_read,
  sender,
  subject,
  body_preview,
  received_date_time,
}) {
  const {
    emailAddress: { name },
  } = sender;

  const currTheme = useSelector(selectTheme);

  const emailThreadOptions = () => {
    return (
      <div className="divide-y divide-gray-100 dark:divide-gray-600 flex flex-col">
        <div className="email-show-more-container">
          <div className="email-show-more" style={{ fontSize: "13px" }}>
            <span>Reply</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
        <div className="email-show-more-container">
          <div className="email-show-more" style={{ fontSize: "13px" }}>
            <span>Reply All</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
        <div className="email-show-more-container">
          <div className="email-show-more" style={{ fontSize: "13px" }}>
            <span>Forward</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
        <div
          className="email-show-more-container"
          //  onClick={() => {
          //    setDeleteModal(true);
          //    setDeleteId(mail_id);
          //  }}
        >
          <div className="email-show-more" style={{ fontSize: "13px" }}>
            <span>Delete</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
        <div className="email-show-more-container">
          <div className="email-show-more" style={{ fontSize: "13px" }}>
            <span>Mark as unread</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* redirecting to slug for detail */}
      <Link to={`/email/${mail_id}`} className="flex flex-col justify-center">
        <div className={`flex justify-between items-center text-sm`}>
          {/* organization image */}
          <div className="flex flex-row space-x-2 overflow-hidden">
            <div>
              <Avatar size={34}>{name?.charAt(0).toUpperCase()}</Avatar>
            </div>
            <div className="flex flex-col space-y-1">
              <div
                className={`text-gray-900 dark:text-gray-300 line-clamp-1 ${
                  is_read ? "" : "font-semibold"
                }`}
              >
                {subject}
              </div>
              <div className="w-full flex items-center space-x-2 pt-1">
                <div className="text-gray-500 w-full line-clamp-1 text-xs md:text-sm">
                  {body_preview}
                </div>
              </div>
              {/* time */}
              <div className="flex font-semibold space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="mb-1">
                  <BiTimeFive />
                </span>
                <span>{moment(received_date_time).fromNow()}</span>
              </div>
            </div>
          </div>
          <div className=" flex items-center justify-center pr-4 h-8 w-8">
            {/* more options */}
            <Popover
              placement="right"
              content={emailThreadOptions(mail_id)}
              color={`${currTheme === "DARK" ? "#2C323B" : "#fff"}`}
            >
              <div className="icon-hover-state bg-white dark:bg-DarkButton shadow-lg h-full">
                <div className="h-full text-gray-600 dark:text-gray-400 flex items-center justify-center">
                  <FiMoreHorizontal />
                </div>
              </div>
            </Popover>
          </div>
        </div>
      </Link>
    </>
  );
}
