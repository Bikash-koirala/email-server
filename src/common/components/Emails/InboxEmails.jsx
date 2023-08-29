import React, { useEffect, useState } from "react";
import { Avatar, notification, Popover, Timeline } from "antd";
import DeleteModal from "../DeleteModal/DeleteModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiTimeFive } from "react-icons/bi";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllEmailState,
  selectAllFolderEmails,
  selectAllFolderEmailsLoading,
} from "../../../store/email/selectors";
import { getEmailsByFolder, getLoadMoreEmails } from "../../../store/email";
import moment from "moment";
import EmailSkeletonLoader from "../EmailSkeletonLoader/EmailSkeletonLoader";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  selectDeviceWidth,
  selectLayout,
  selectTheme,
} from "../../../store/appMode/selectors";
import InfiniteScroll from "react-infinite-scroll-component";
import { debounce } from "lodash";
import { addMultiTask } from "../../../store/multitask";
import { RiArrowRightSLine } from "react-icons/ri";
import EmailThread from "./EmailThread";
import {
  selectAllEmailSelected,
  selectSelectedEmailLists,
} from "../../../store/ribbon/selectors";
import IconWrapper from "../Icon";
import { ReactComponent as CheckmarkCircleFilled } from "../../../assets/svg/CheckmarkCircleFilled.svg";
import { ReactComponent as CircleRegular } from "../../../assets/svg/CircleRegular.svg";
import {
  addSelectedCurrentEmail,
  removeSelectedCurrentEmail,
} from "../../../store/ribbon";
import { REPLY_MODE } from "../../../constants";
import { truncateString } from "../../../utils/truncate";

export default function InboxEmails() {
  // getting the emailId from individal mail
  const location = useLocation();
  const navigate = useNavigate();
  const currentFolderId = qs.parse(location.search);
  const [folderId, setFolderId] = useState(null);
  const { emailId } = 1;
  // for deleting the mail
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // for deleting the mail we need slug/id
  const [deleteId, setDeleteId] = useState(null);
  const [mailId, setMailId] = useState(null);
  const [initialScrollY, setInitialScrollY] = useState(0);
  const currTheme = useSelector(selectTheme);
  const [threadId, setThreadId] = useState(null);

  //TODO: need to refactor above code as we go through
  const layout = useSelector(selectLayout);
  const { next, folder_id } = useSelector(selectAllEmailState);
  const emails = useSelector(selectAllFolderEmails);
  const isEmailLoading = useSelector(selectAllFolderEmailsLoading);
  const selectedEmailLists = useSelector(selectSelectedEmailLists);
  const isAllEmailSelected = useSelector(selectAllEmailSelected);
  // getting the width
  const deviceWidth = useSelector(selectDeviceWidth);

  // console.log(emails[2]?.is_read);

  const dispatch = useDispatch();

  const handleLoadMore = () => {
    dispatch(
      getLoadMoreEmails({ folder_id: folderId || folder_id, page: next })
    );
  };

  const handleScroll = debounce((ev) => {
    setInitialScrollY(ev.target.scrollTop);
  }, 500);

  const getIsEmailSelected = (mail_id) => {
    if (isAllEmailSelected) return true;
    return selectedEmailLists?.some((mId) => mId === mail_id);
  };

  const handleCurrentEmailSelect = (mail_id) => {
    dispatch(
      getIsEmailSelected(mail_id)
        ? removeSelectedCurrentEmail(mail_id)
        : addSelectedCurrentEmail(mail_id)
    );
  };

  const handleForward = (mailId, subject) => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(subject),
        mailId,
        taskMode: REPLY_MODE.forward,
      })
    );
  }

  const handleReply = (mailId, subject) => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(subject),
        mailId,
        taskMode: REPLY_MODE.reply,
      })
    );
  }

  const handleReplyAll = (mailId, subject) => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(subject),
        mailId,
        taskMode: REPLY_MODE.replyAll,
      })
    );
  }

  // on mail delete
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      // const res = await dispatch(deleteEmail(deleteId));
      // if (res?.error) {
      //   throw new Error(res.error?.message);
      // }
      setDeleteModal(false);
      setConfirmLoading(false);
      notification.success({
        message: "Mail Deleted Successfully",
        description: "You can view all the deleted mails on trash list.",
        placement: "top",
      });
    } catch (error) {
      setDeleteModal(false);
      setConfirmLoading(false);
      notification.error({
        message: error?.message,
        placement: "top",
      });
    }
  };

  // for clearing the mailId
  useEffect(() => {
    if (!emailId) {
      setMailId(null);
    }
  }, [emailId, mailId]);

  useEffect(() => {
    if (currentFolderId?.id && location.pathname !== "/email") {
      setFolderId(currentFolderId?.id);
      dispatch(getEmailsByFolder(currentFolderId?.id));
    }
  }, [location.pathname]);

  useEffect(() => {
    dispatch(
      addMultiTask({
        taskId: "primaryEmailBoard",
        taskHeading: "Select an item to read",
      })
    );
  }, []);

  // more options popover
  const moreOptions = (mail_id, subject) => {
    return (
      <div className="divide-y divide-gray-100 dark:divide-gray-600 flex flex-col">
        <div className="email-show-more-container">
          <div className="email-show-more" style={{ fontSize: "13px" }} onClick={() => handleReply(mail_id, subject)}>
            <span>Reply</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
        <div className="email-show-more-container">
          <div className="email-show-more" style={{ fontSize: "13px" }} onClick={() => handleReplyAll(mail_id, subject)}>
            <span>Reply All</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
        <div className="email-show-more-container">
          <div className="email-show-more" style={{ fontSize: "13px" }} onClick={() => handleForward(mail_id, subject)}>
            <span>Forward</span>
            {/* <span>
              <img src={DeleteMailIcon} alt="delete" className="h-4 w-4" />
            </span> */}
          </div>
        </div>
        <div
          className="email-show-more-container"
          onClick={() => {
            setDeleteModal(true);
            setDeleteId(mail_id);
          }}
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
      {/* delete modal */}
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        confirmLoading={confirmLoading}
        handleOk={handleOk}
        deleteAlertTitle="Are you sure you want to remove this email?"
      />

      <div
        id="email-braintip-holder"
        className={`${
          layout === "HORIZONTAL"
            ? "horizontal-middle-layout"
            : "vertical-middle-layout"
        }  w-full overflow-y-auto overflow-x-hidden`}
        style={{
          paddingBottom: 50,
        }}
      >
        {isEmailLoading ? (
          <div className="p-3">
            <EmailSkeletonLoader />
          </div>
        ) : (
          <InfiniteScroll
            scrollableTarget="email-braintip-holder"
            onScroll={handleScroll}
            key={next}
            initialScrollY={initialScrollY}
            dataLength={10}
            next={handleLoadMore}
            hasMore={!!next}
            loader={<EmailSkeletonLoader />}
            endMessage={
              emails?.length > 0 && (
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              )
            }
            style={{
              overflowX: "hidden",
            }}
          >
            <div className="divide-gray-300 dark:divide-gray-700 divide-y">
              {emails?.map((email, index) => {
                const {
                  subject,
                  body_preview,
                  received_date_time,
                  mail_id,
                  is_read,
                  sender,
                  threads,
                } = email;
                // destructuring name from sender
                const {
                  emailAddress: { name },
                } = sender;
                const isEmailSelected = getIsEmailSelected(mail_id);
                return (
                  <div
                    key={mail_id}
                    onClick={() => {
                      setMailId(mail_id);
                    }}
                    // className={!is_read ? "bg-slate-100 border-b" : "border-b"}
                  >
                    {/* redirecting to slug for detail */}
                    <Link
                      to={`${
                        deviceWidth >= 768
                          ? `/email/${mail_id}`
                          : `/email/email-detail/${mail_id}`
                      }`}
                      className="flex flex-col justify-center"
                    >
                      <div
                        className={`${
                          !is_read
                            ? "bg-[#F6F9FD] dark:bg-Dark2 transition-all duration-300 border-l-4 border-[#D3E2FC] dark:border-gray-500"
                            : "mail-container-scale"
                        }  mail-container-css mail-container flex justify-between items-center text-sm ${
                          isEmailSelected ? "bg-[#e3efff]" : ""
                        }`}
                      >
                        {/* organization image */}
                        <div className="flex flex-row space-x-2 p-3 overflow-hidden">
                          <div
                            className={`${
                              isEmailSelected ? "show-checked" : ""
                            } avatar-holder`}
                          >
                            <IconWrapper
                              icon={
                                isEmailSelected ? (
                                  <CheckmarkCircleFilled
                                    style={{
                                      color: "#0078d4",
                                    }}
                                  />
                                ) : (
                                  <CircleRegular />
                                )
                              }
                              onClick={() => handleCurrentEmailSelect(mail_id)}
                              style={{
                                cursor: "pointer",
                              }}
                              wrapperClass="check-holder"
                            />
                            {!isEmailSelected && (
                              <Avatar size={34}>
                                {name?.charAt(0).toUpperCase()}
                              </Avatar>
                            )}
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
                              {threads?.length > 1 && (
                                <div
                                  className={` thread-button `}
                                  onClick={() =>
                                    setThreadId((threadId) =>
                                      threadId === mail_id ? null : mail_id
                                    )
                                  }
                                >
                                  <RiArrowRightSLine
                                    className={`${
                                      threadId === mail_id
                                        ? "rotate-90"
                                        : "rotate-0"
                                    } transform transition-all duration-300`}
                                  />
                                </div>
                              )}

                              <div className="text-gray-500 w-full line-clamp-1 text-xs md:text-sm">
                                {body_preview}
                              </div>
                            </div>
                            {/* time */}
                            <div className="flex pt-1 font-semibold space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <span className="mb-1">
                                <BiTimeFive />
                              </span>
                              <span>
                                {moment(received_date_time).fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* more options */}
                        {/* <div className=" flex items-center justify-center pr-4 h-8 w-8">
                          <Popover
                            placement="right"
                            content={moreOptions(mail_id, subject)}
                            color={`${
                              currTheme === "DARK" ? "#2C323B" : "#fff"
                            }`}
                          >
                            <div className="icon-hover-state bg-white dark:bg-DarkButton shadow-lg h-full">
                              <div className="h-full text-gray-600 dark:text-gray-400 flex items-center justify-center">
                                <FiMoreHorizontal />
                              </div>
                            </div>
                          </Popover>
                        </div> */}
                      </div>
                      {/* mapping the specific thread */}
                      {threadId === mail_id && (
                        <div className="p-3 pl-14">
                          <Timeline>
                            {threads?.slice(1)?.map((thread) => {
                              return (
                                <Timeline.Item color="green">
                                  <EmailThread
                                    {...thread}
                                    key={thread?.mail_id}
                                  />
                                </Timeline.Item>
                              );
                            })}
                          </Timeline>
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}
