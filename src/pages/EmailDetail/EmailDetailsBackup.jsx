import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import NoEmailsFound from "../../assets/images/NoEmailFound.svg";
import { Avatar, Tooltip } from "antd";
import axios from "axios";
import moment from "moment";
import { HTTP_METHODS } from "../../constants/http";
import config from "../../config";
import { REPLY_MODE } from "../../constants";
import IconWrapper from "../../common/components/Icon";
import { ReactComponent as AddSquareMultipleRegular } from "../../assets/svg/AddSquareMultipleRegular.svg";
import { ReactComponent as ArrowForwardRegular } from "../../assets/svg/ArrowForwardRegular.svg";
import { ReactComponent as ArrowReplyRegular } from "../../assets/svg/ArrowReplyRegular.svg";
import { ReactComponent as InfoRegular } from "../../assets/svg/InfoRegular.svg";

import { CloseOutlined } from "@ant-design/icons";
import { selectDeviceWidth } from "../../store/appMode/selectors";

import EmailDetailThread from "../../common/components/Emails/EmailDetailThread";
import { useDispatch, useSelector } from "react-redux";
import { addMultiTask } from "../../store/multitask";
import {
  removeCurrentEmailDetails,
  updateCurrentEmailDetails,
} from "../../store/email";
import { truncateString } from "../../utils/truncate";

export default function EmailDetailsBackup() {
  const [emailDetail, setEmailDetail] = useState([]);
  const { emailId } = useParams();
  // email is opened
  const [emailIsOpened, setEmailIsOpened] = useState(true);
  // getting email thread body
  const [emailThreadBody, setEmailThreadBody] = useState({});
  // toggle email and email
  const [toggleEmail, setToggleEmail] = useState(false);
  const [emailThread, setEmailThread] = useState([]);
  const deviceWidth = useSelector(selectDeviceWidth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const iconStyling = {
    height: "21px",
    width: "21px",
    color: "#0F6CBD",
  };

  // const emailMorePrimary = [
  //   {
  //     label: "Reply",
  //     icon: <ArrowReplyRegular style={iconStyling} />,
  //   },
  //   {
  //     label: "Forward",
  //     icon: <ArrowForwardRegular style={iconStyling} />,
  //   },
  //   {
  //     label: "Delete",
  //     icon: <DeleteRegular style={iconStyling} />,
  //   },
  // ];

  // const emailMoreSecondary = [
  //   {
  //     label: "Print",
  //     icon: <PrintRegular style={iconStyling} />,
  //   },
  //   {
  //     label: "Download",
  //     icon: <ArrowDownloadRegular style={iconStyling} />,
  //   },
  // ];

  const toggleThreadHandler = (mail_id) => {
    let newEmailThread = [...emailThread]?.map((thread) => {
      const { isOpened } = thread;
      if (mail_id === thread?.mail_id) {
        return {
          ...thread,
          isOpened: !isOpened,
        };
      }
      return thread;
    });
    setEmailThread(newEmailThread);
  };

  useEffect(() => {
    if (!emailId) return;
    if (emailId.length > 16) {
      axios({
        url: `${config.apiBaseUrl}/integration/get/mail-detail/`,
        method: HTTP_METHODS.GET,
        params: {
          mail_id: emailId,
        },
      })
        .then((res) => {
          setEmailDetail(res.data);
          dispatch(updateCurrentEmailDetails(res.data));
          // pushing isOpened val into email thread
          setEmailThread(
            res?.data?.threads?.map((thread) => {
              return {
                ...thread,
                isOpened: false,
              };
            })
          );
          // setReplyMode(REPLY_MODE.noAction);
        })
        .catch((err) => {
          dispatch(removeCurrentEmailDetails());
          console.log("err", err);
        });
    }
  }, [emailId]);

  // fetching the body preview for email thread
  useEffect(() => {
    if (!emailId) return;
    if (emailId) {
      axios({
        url: `${config.apiBaseUrl}/integration/get/mail-detail/?mail_id=${emailId}`,
        method: HTTP_METHODS.GET,
        params: {
          emailId: emailId,
        },
      })
        .then((res) => {
          setEmailThreadBody(res.data?.body);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [emailId]);

  const handleForward = () => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(emailDetail.subject),
        mailId: emailDetail.id,
        taskMode: REPLY_MODE.forward,
      })
    );
  };

  const handleReply = () => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(emailDetail.subject),
        mailId: emailDetail.id,
        taskMode: REPLY_MODE.reply,
      })
    );
  };

  let renderIcon = <AddSquareMultipleRegular />;

  const emailCollapseHandler = () => {
    setEmailIsOpened(!emailIsOpened);
  };

  // opening the email detail when email is changes on initial render
  useEffect(() => {
    setEmailIsOpened(true);
  }, [emailId]);

  const closeEmailDetailHandler = () => {
    navigate("/email");
  };

  const generateEmailPreview = (emailDetail, isEmailAction = false) => {
    return (
      <div>
        <div>
          <div className="border-b border-gray-200 py-2.5 ">
            <div className="flex justify-between items-center px-4">
              <div className="flex space-x-2 items-center">
                {/* close email */}
                {deviceWidth <= 768 && (
                  <span
                    className="close-email-detail"
                    onClick={closeEmailDetailHandler}
                  >
                    <div className="text-[#0F6CBD]">
                      <CloseOutlined />
                    </div>
                    <div className="mt-1">Close</div>
                  </span>
                )}
                <span className="md:text-xl font-bold text-lg dark:text-gray-300 text-gray-700 line-clamp-1">
                  {emailDetail?.subject}
                </span>
              </div>
              {emailDetail?.threads?.length > 1 && (
                <div
                  className="text-sm text-gray-500 cursor-pointer "
                  onClick={emailCollapseHandler}
                >
                  <IconWrapper
                    style={{
                      marginRight: 5,
                    }}
                    icon={renderIcon}
                    // wrapperClass={buttonLabel ? "mr-2.5" : ""}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="overflow-y-auto email-detail-inner-container px-1 pb-20">
            <div
              className={`${
                !emailIsOpened && "hover:bg-gray-100"
              } mt-2 border border-gray-200`}
            >
              <div className="py-4">
                <div className="flex items-center justify-between px-4 w-full">
                  <div
                    className="flex flex-row space-x-3 w-full"
                    onClick={() => setEmailIsOpened(!emailIsOpened)}
                  >
                    <div>
                      <Avatar size={40}>
                        {emailDetail?.sender?.emailAddress?.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </Avatar>
                    </div>
                    <div className="flex flex-col text-gray-700">
                      <div style={{ fontSize: "16px" }}>
                        {emailDetail?.sender?.emailAddress?.name}
                      </div>
                      {emailIsOpened && (
                        <div
                          className=" text-gray-500 line-clamp-1, font-light"
                          style={{ fontSize: "13px" }}
                        >
                          <div>
                            {emailDetail?.toRecipients?.length > 0 && (
                              <div>
                                <span>To:</span>
                                <span>
                                  {" "}
                                  {emailDetail?.toRecipients?.map(
                                    (item, index) => (
                                      <span key={index}>
                                        {item?.emailAddress?.name + "; "}
                                      </span>
                                    )
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            {emailDetail?.ccRecipients?.length > 0 && (
                              <div>
                                <span>CC:</span>
                                <span>
                                  {" "}
                                  {emailDetail?.ccRecipients?.map((item, i) => (
                                    <span key={i}>
                                      {item?.emailAddress?.name + "; "}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            {emailDetail?.bccRecipients?.length > 0 && (
                              <div>
                                <span>BCC:</span>
                                <span>
                                  {emailDetail?.bccRecipients?.map(
                                    (item, i) => (
                                      <span key={i}>
                                        {item?.emailAddress?.name + "; "}
                                      </span>
                                    )
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {!emailIsOpened && (
                        <div
                          className=" text-gray-500 line-clamp-1 font-light"
                          style={{ fontSize: "13px" }}
                        >
                          {emailDetail?.bodyPreview ?? "N/A"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 w-64 items-end">
                    {emailIsOpened && (
                      <div className="flex flex-row space-x-2">
                        <Tooltip title={"Reply"} color={"#fff"}>
                          <span
                            className="cursor-pointer p-1 hover:bg-gray-100"
                            onClick={handleReply}
                          >
                            <ArrowReplyRegular style={iconStyling} />
                          </span>
                        </Tooltip>
                        <Tooltip title={"Forward"} color={"#fff"}>
                          <span
                            className="cursor-pointer p-1 hover:bg-gray-100"
                            onClick={handleForward}
                          >
                            <ArrowForwardRegular style={iconStyling} />
                          </span>
                        </Tooltip>
                        {/* <span className="cursor-pointer p-1 hover:bg-gray-100">
                          <Popover
                            content={EmailMoreActions}
                            trigger="click"
                            placement="left"
                            showArrow={false}
                            open={moreOpen}
                            onOpenChange={(newOpen) => setMoreOpen(newOpen)}
                          >
                            <MoreHorizontalRegular style={iconStyling} />
                          </Popover>
                        </span> */}
                      </div>
                    )}
                    {!emailIsOpened && emailDetail?.threads?.length === 1 && (
                      <Tooltip title={"show More"} color={"#fff"}>
                        <InfoRegular
                          style={{
                            height: "17px",
                            width: "17px",
                            color: "#718096",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    )}
                    <div className="text-gray-500 text-xs tracking-wide">
                      <span>
                        {moment(emailDetail?.sentDateTime).format("llll")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* email body preview */}
              {emailIsOpened && (
                <>
                  <div className="flex flex-col items-center">
                    <div
                      className=" p-4 dark:bg-[#2C323B]"
                      dangerouslySetInnerHTML={{
                        __html: emailDetail?.body?.content.replace(
                          "href",
                          "target='_blank' href"
                        ),
                      }}
                    />
                  </div>
                  {!isEmailAction && (
                    <div className="p-4">
                      <div className="px-12 flex space-x-3">
                        <button
                          onClick={handleReply}
                          className="reply-forward-email"
                        >
                          <span>
                            <ArrowReplyRegular style={iconStyling} />
                          </span>
                          <span className="mt-1">Reply</span>
                        </button>
                        <button
                          onClick={handleForward}
                          className="reply-forward-email"
                        >
                          <span>
                            <ArrowForwardRegular style={iconStyling} />
                          </span>
                          <span className="mt-1">Forward</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {/* email thread section */}
            <>
              {emailThread?.length > 1 &&
                emailThread?.slice(1)?.map((thread, index) => {
                  return (
                    <EmailDetailThread
                      {...thread}
                      key={thread?.mail_id}
                      emailThreadBody={emailThreadBody}
                      toggleThreadHandler={toggleThreadHandler}
                      iconStyling={iconStyling}
                    />
                  );
                })}
            </>
          </div>
        </div>
      </div>
    );
  };

  // if (replyMode === REPLY_MODE.reply)
  //   return (
  //     <EmailComposeBox
  //       mode={replyMode}
  //       emailDetail={emailPayload}
  //       initialContent={ReactDOMServer.renderToStaticMarkup(
  //         emailPreview(emailDetail)
  //       )}
  //     />
  //   );
  // if (replyMode === REPLY_MODE.forward)
  //   return (
  //     <EmailComposeBox
  //       mode={replyMode}
  //       emailDetail={emailPayload}
  //       initialContent={ReactDOMServer.renderToStaticMarkup(
  //         emailPreview(emailDetail)
  //       )}
  //     />
  //   );

  return (
    <>
      <div className="">
        {emailDetail?.length !== 0 ? (
          generateEmailPreview(emailDetail)
        ) : (
          <React.Fragment>
            <div
              className="flex items-center justify-center flex-col"
              style={{ height: "590px" }}
            >
              <img src={NoEmailsFound} alt="no_email_found" />
              <div className="text-md mt-3 text-gray-700 dark:text-gray-200">
                Select an item to read
              </div>
              <div className="text-sm mt-1 text-gray-400">
                Nothing is selected
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  );
}
