import React, { useEffect, useRef, useState } from "react";
import "../../../assets/css/dashboard.css";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../../../common/static/Sidebar";
import DashboardHeader from "../../static/DashboardHeader";
import EmailDetail from "../../../pages/EmailDetail/EmailDetail";
import OutletContainer from "../../static/OutletContainer";
import { Badge, Drawer } from "antd";
import Mailbox from "../../apis/Mailbox";
import useMailbox from "../../hooks/mailbox";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmailsByFolder,
  syncAllEmails,
  updateCurrentEmailFolder,
  updateEmailSilently,
  updateFolders,
} from "../../../store/email";
import SyncLoader from "../../components/Emails/SyncLoader";
import { selectEmailSync } from "../../../store/email/selectors";
import { EMAIL_SYNCED_STATUS, LAYOUT_MODE } from "../../../constants";
// react icons
import { selectLayout } from "../../../store/appMode/selectors";
import {
  selectCurrentTaskCount,
  selectIsEmailOpened,
} from "../../../store/multitask/selectors";
import { ReactComponent as ArchiveRegular } from "../../../assets/svg/ArchiveRegular.svg";
import { ReactComponent as DeleteRegular } from "../../../assets/svg/DeleteRegular.svg";
import { ReactComponent as DraftsRegular } from "../../../assets/svg/DraftsRegular.svg";
import { ReactComponent as FolderProhibitedRegular } from "../../../assets/svg/FolderProhibitedRegular.svg";
import { ReactComponent as FolderRegular } from "../../../assets/svg/FolderRegular.svg";
import { ReactComponent as MailInboxRegular } from "../../../assets/svg/MailInboxRegular.svg";
import { ReactComponent as PersonAccountsRegular } from "../../../assets/svg/PersonAccountsRegular.svg";
import { ReactComponent as SendRegular } from "../../../assets/svg/SendRegular.svg";
import { ReactComponent as SettingsRegular } from "../../../assets/svg/SettingsRegular.svg";

import IconWrapper from "../../components/Icon";
import Ribbon from "../../components/Ribbon";

import Auth from "../../apis/Auth";

import { w3cwebsocket as W3CWebSocket } from "websocket";
import newEmailAudio from "../../../assets/alerts/email-notification.mp3";
import { updateDeviceWidth } from "../../../store/appMode";

export default function DashboardLayouts() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState();
  const [modal, setModal] = useState(false);
  const ignoreLinksForEmailDetail = ["/email/settings/account"];
  const mailboxes = useMailbox();
  const [mailSynced, setMailSynced] = useState(false);
  const [defaultSelectedKey, setDefaultSelectedKey] = useState(null);
  const layout = useSelector(selectLayout);
  const isMailOpened = useSelector(selectIsEmailOpened);
  const taskCount = useSelector(selectCurrentTaskCount);
  const dispatch = useDispatch();
  const sync = useSelector(selectEmailSync);

  const [sidebarOptions, setSidebarOptions] = useState([
    {
      label: "Settings",
      key: "settings",
      icon: <IconWrapper icon={<SettingsRegular />} />,
      children: [
        {
          icon: <IconWrapper icon={<PersonAccountsRegular />} />,
          label: <Link to="settings/account">Account</Link>,
          key: "settings-item-1",
        },
      ],
    },
  ]);

  const generateLabelOrder = (label) => {
    let order = Infinity;
    let icon = null;
    switch (label) {
      case "Inbox":
        order = 1;
        icon = <IconWrapper icon={<MailInboxRegular />} />;
        break;
      case "Sent Items":
        order = 2;
        icon = <IconWrapper icon={<SendRegular />} />;
        break;
      case "Deleted Items":
        order = 3;
        icon = <IconWrapper icon={<DeleteRegular />} />;
        break;
      case "Conversation History":
        order = 5;
        icon = <IconWrapper icon={<FolderRegular />} />;
        break;
      case "Archive":
        order = 6;
        icon = <IconWrapper icon={<ArchiveRegular />} />;
        break;
      case "Drafts":
        order = 7;
        icon = <IconWrapper icon={<DraftsRegular />} />;
        break;
      case "Junk Email":
        order = 7;
        icon = <IconWrapper icon={<FolderProhibitedRegular />} />;
        break;
      default:
        icon = <IconWrapper icon={<FolderRegular />} />;
        break;
    }
    return { order, icon };
  };

  const makeSidebar = (arr) => {
    return arr.map((sb) => {
      if (sb.display_name === "Inbox") {
        dispatch(updateCurrentEmailFolder(sb.id));
        setDefaultSelectedKey(sb.id);
      }
      if (sb.display_name === "Outbox") {
        return;
      }
      return {
        label: (
          <Link to={`${sb.display_name}?folder_id=${sb.folder_id}&id=${sb.id}`}>
            <div className="flex justify-between items-center">
              <div
                className="text-gray-600 dark:text-gray-300"
                style={{ fontSize: "14px", paddingLeft: 10 }}
              >
                {sb.display_name}
              </div>
              {sb.unread_item_count > 0 ? (
                <Badge
                  count={sb.unread_item_count}
                  color="#f8d5d5"
                  style={{
                    fontSize: 14,
                  }}
                ></Badge>
              ) : (
                ""
              )}
            </div>
          </Link>
        ),
        key: `key-${sb.id}`,
        ...generateLabelOrder(sb.display_name, arr),
      };
    });
  };

  const resizeHandler = () => {
    setWidth(window?.innerWidth);
    dispatch(updateDeviceWidth(window?.innerWidth));
  };

  // when browser is resized
  useEffect(() => {
    const fetchMail = async () => {
      try {
        if (mailboxes.length <= 0) return;
        setMailSynced(false);
        const { data } = await Mailbox.fetchMailboxes();
        if (data) {
          const response = await Mailbox.fetchMailboxesFolders();
          dispatch(updateFolders(response?.data));

          const generatedSidebarOptions = makeSidebar(response.data).sort(
            (a, b) => {
              if (a.order > b.order) return 1;
              if (a.order < b.order) return -1;
              return 0;
            }
          );
          setSidebarOptions([...generatedSidebarOptions, ...sidebarOptions]);
        }
      } catch (error) {
        window.location.href = "unexpected-error";
        throw new Error(error);
      } finally {
        setMailSynced(true);
      }
    };
    fetchMail().then(async () => {
      if (location.pathname !== "/email") return;
      await dispatch(syncAllEmails());
      await dispatch(getEmailsByFolder());
    });

    window.addEventListener("resize", resizeHandler);
    /*
    // audio && audio.play();
    // --------------- socket connect -------
    const token = Auth.getLocalAccessToken();
    const socket = new W3CWebSocket(
      `wss://es-api-dev.braintip.ai/ws/mail-notification/?token=${token}`
    );

    
    socket.onopen = (event) => {
      console.log("web socket is connected");
    };
    socket.onmessage = (ev) => {
      // const notification = new Audio(newEmailAudio);
      // notification.play();
      console.log(ev, 'socket responses');
    };
    */
    resizeHandler();

    return () => {
      // if (socket.readyState === 1) {
      //   // <-- This is important
      //   socket.close();
      // }
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (width <= 1300) {
      setCollapsed(true);
    } else if (width <= 768) {
      dispatch(updateLayout(LAYOUT_MODE.normal));
    } else {
      setCollapsed(false);
    }
  }, [width]);

  // for toggling the button
  const toggleHandler = () => {
    if (width < 1100) {
      setModal(true);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const hideInbox = () => {
    if (!isMailOpened && taskCount > 1) {
      if (layout === LAYOUT_MODE.vertical) {
        return true;
      }
    }
    return false;
  };

  if (!mailSynced) return <Loader />;

  return (
    <>
      <div className=" h-screen flex flex-row">
        {/* sidebar */}
        <div>
          {width < 1100 ? (
            <Drawer
              placement="left"
              closable={false}
              width={200}
              onClose={() => setModal(false)}
              open={modal}
              getContainer={false}
            >
              <Sidebar
                sidebarOptions={sidebarOptions}
                defaultSelected={defaultSelectedKey}
              />
            </Drawer>
          ) : (
            <div
              className={`${
                collapsed
                  ? "sidebar-container-collapsed"
                  : "sidebar-container-opened"
              } sidebar-container `}
            >
              <Sidebar
                sidebarOptions={sidebarOptions}
                collapsed={collapsed}
                width={width}
                defaultSelected={defaultSelectedKey}
              />
            </div>
          )}
        </div>
        {/* middle contents */}
        <div className="flex w-full flex-col ">
          {/* header */}
          <div className="w-full">
            <DashboardHeader toggleHandler={toggleHandler} width={width} />
          </div>
          <div className="p-4 h-full dark:bg-Dark1 pb-0">
            <Ribbon />
            <div
              className={`${
                layout === "HORIZONTAL" ? "flex-row" : "flex-col"
              } flex w-full shadow-xl bg-white dark:bg-Dark2 rounded-lg relative h-full`}
            >
              {sync === EMAIL_SYNCED_STATUS.request && <SyncLoader />}
              {/* Impelement dynamic width here w-1/3*/}
              <div
                className={`${
                  // layout === LAYOUT_MODE.horizontal
                  //   ? "w-2/5 max-width-sidebar "
                  //   : "flex-1"
                  width <= 768 ? `flex-1` : `w-2/5 max-width-sidebar`
                } middle-container ${hideInbox() ? "hidden" : ""} `}
              >
                <div className="border-r-2 border-gray-100 dark:border-gray-700 h-full">
                  <div className="middle-inner-container h-full">
                    <OutletContainer />
                  </div>
                </div>
              </div>
              {width >= 768 &&
                !ignoreLinksForEmailDetail?.includes(location?.pathname) && (
                  <div className={` flex-1 end-container`}>
                    <div
                      className={`${
                        layout === "HORIZONTAL"
                          ? "horizontal-end-layout"
                          : "vertical-end-layout"
                      } w-full`}
                    >
                      <EmailDetail />
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
