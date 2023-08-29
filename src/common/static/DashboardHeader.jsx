import React, { useEffect, useState } from "react";
import { Avatar, Popover, Switch } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { AiOutlineSync } from "react-icons/ai";
import "../../assets/css/header.css";
import Auth from "../apis/Auth";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile } from "../../store/users/selectors";
import LayoutRight from "../../assets/icons/right.png";
import { getEmailsByFolder, syncAllEmails } from "../../store/email";
import { useLocation } from "react-router-dom";
import { EMAIL_SYNCED_STATUS, LAYOUT_MODE, THEME } from "../../constants";
import { selectEmailSync } from "../../store/email/selectors";
import qs from "qs";
import { updateLayout, updateTheme } from "../../store/appMode";
import { selectLayout, selectTheme } from "../../store/appMode/selectors";
import { ReactComponent as AlertRegular } from "../../assets/svg/AlertRegular.svg";
import { ReactComponent as BoardRegular } from "../../assets/svg/BoardRegular.svg";
import { ReactComponent as LineHorizontal3Regular } from "../../assets/svg/LineHorizontal3Regular.svg";
import IconWrapper from "../components/Icon";

export default function DashboardHeader({ toggleHandler, width }) {
  const { customer_name, user_email, username } = useSelector(selectProfile);
  const currTheme = useSelector(selectTheme);
  const currPlacement = useSelector(selectLayout);
  const [dashboardPlacement, setDashboardPlacement] = useState(currPlacement);
  const [checked, setChecked] = useState(currTheme);
  const ignoreLinksForEmailDetail = ["/email/settings/account"];
  // sync email
  const dispatch = useDispatch();
  const location = useLocation();

  // sync email
  const syncEmailLoading = useSelector(selectEmailSync);

  const currentFolderId = qs.parse(location.search);

  // syncing the email
  const handleSyncEmail = async () => {
    await dispatch(syncAllEmails());
    await dispatch(getEmailsByFolder(currentFolderId?.id));
  };

  const signOut = () => {
    Auth.logOut();
  };

  const handleUpdateLayout = (layout) => {
    setDashboardPlacement(layout);
    dispatch(updateLayout(layout));
  };

  const handleUpdateTheme = (theme) => {
    const updatedTheme = theme === THEME.dark ? THEME.light : THEME.dark;
    setChecked(updatedTheme);
    dispatch(updateTheme(updatedTheme));
  };

  useEffect(() => {
    if (currTheme === THEME.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [currTheme]);

  const popupLinks = () => {
    return (
      <>
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          <div className="inner-popup flex items-center space-x-3 justify-center">
            {/* user avatar */}
            <div>
              <Avatar size={64}>
                {username.substr(0,2).toUpperCase()}
              </Avatar>
            </div>
            {/* user info */}
            <div>
              <div className="flex flex-col space-y-1">
                <div className="font-semibold text-xl text-gray-600 dark:text-gray-200 capitalize">
                  {username}
                </div>
                <div className="text-sm text-gray-400 font-light">
                  {user_email}
                </div>
              </div>
            </div>
          </div>
          <div className="sign-out-container flex justify-between items-center">
            <div className="text-gray-500 dark:text-gray-400">
              {customer_name}
            </div>
            <button onClick={signOut} className="sign-out-button">
              Sign Out
            </button>
          </div>
        </div>
      </>
    );
  };

  const placementContent = (
    <div className=" divide-gray-100 dark:divide-gray-600 divide-y text-gray-400">
      {[LAYOUT_MODE.horizontal, LAYOUT_MODE.vertical]?.map(
        (placement, index) => {
          return (
            <div
              className="p-2 px-3 cursor-pointer flex space-x-2 items-center"
              key={index}
              onClick={() => handleUpdateLayout(placement)}
            >
              {dashboardPlacement === placement ? (
                <span className="text-green-600 w-6">
                  <CheckOutlined />
                </span>
              ) : (
                <span className="w-6"></span>
              )}
              <span className="flex items-end justify-end w-full ">
                {placement}
              </span>
            </div>
          );
        }
      )}
    </div>
  );

  // setting dark mode into local storage
  useEffect(() => {
    localStorage.setItem("dark-mode", checked);
  }, [checked]);

  // dashboard popup
  const dashboardPopup = () => {
    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        <div className="flex flex-col">
          <Popover
            content={placementContent}
            placement="left"
            color={`${currTheme === "DARK" ? "#2C323B" : "#fff"}`}
          >
            <div className="p-1 px-2 select-none flex cursor-pointer text-gray-600 dark:text-gray-300">
              <div className="hover:bg-gray-50 dark:hover:bg-[#22262F] items-center p-2 w-full rounded-md flex justify-between">
                <span>Placement</span>
                <span>
                  <img
                    src={LayoutRight}
                    alt="layout_right"
                    className="h-6 w-6"
                  />
                </span>
              </div>
            </div>
          </Popover>
        </div>
        <div className="p-3 px-4 space-x-6 flex items-center justify-between text-gray-600 dark:text-gray-300">
          <span>Dark Mode</span>
          <span>
            <div className="cursor-pointer">
              <Switch
                // now we want to disable this feture..
                disabled={true}
                onChange={() => handleUpdateTheme(checked)}
                checked={checked === THEME.dark}
              />
              {/* <Switch onChange={() => () => {setChecked(!checked)} checked={checked}} /> */}
            </div>
          </span>
        </div>
        {/* sync email */}
        <div className="p-1 px-2 select-none flex cursor-pointer text-gray-600 dark:text-gray-300">
          <div
            className="hover:bg-gray-50 dark:hover:bg-[#22262F]  items-center p-2 w-full rounded-md flex justify-between"
            onClick={handleSyncEmail}
          >
            <span>Sync Email</span>
            <span
              className={`${
                syncEmailLoading === EMAIL_SYNCED_STATUS.request
                  ? "sync-icon-rotation"
                  : "sync-icon-rotate-none"
              } flex items-center justify-center text-xl transform transition-all duration-300`}
            >
              <AiOutlineSync />
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="flex items-center h-14 shadow-md  dark:bg-Dark1 dark:border-b dark:border-gray-700 header-block"
        style={{
          background: "#0e205a",
          color: "white",
        }}
      >
        <div className="flex items-center justify-between w-full px-6 h-full">
          {!(width <= 1300 && width >= 1100) && (
            <div
              className="h-full flex items-center justify-start "
              onClick={toggleHandler}
            >
              <div className="cursor-pointer flex items-center justify-center">
                <IconWrapper icon={<LineHorizontal3Regular />} />
              </div>
            </div>
          )}
          <div className="flex items-center justify-center space-x-4 cursor-pointer">
            <div className="flex items-center justify-center space-x-1.5">
              <Popover
                placement="bottom"
                content={dashboardPopup()}
                trigger="click"
                color={`${currTheme === "DARK" ? "#2C323B" : "#fff"}`}
              >
                <div className="h-full w-full hover:bg-sky-900 hover:shadow-lg icon-hover-state  transition-all duration-300">
                  <div className="w-full dark:bg-DarkButton">
                    <div className="w-full flex justify-center items-center">
                      <IconWrapper icon={<BoardRegular />} />
                    </div>
                  </div>
                </div>
              </Popover>
              <div className="icon-hover-state hover:bg-sky-900 hover:shadow-lg">
                <div className="h-full w-full">
                  <IconWrapper icon={<AlertRegular />} />
                </div>
              </div>
            </div>
            <div className="dashboard-header">
              <Popover
                placement="bottomRight"
                content={popupLinks()}
                trigger="click"
                color={`${currTheme === "DARK" ? "#2C323B" : "#fff"}`}
              >
                <Avatar size={37}>
                {username.substr(0,2).toUpperCase()}
                </Avatar>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}