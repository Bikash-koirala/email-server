import React, { useState } from "react";
import { Avatar, Tooltip, Popover } from "antd";
import moment from "moment";
import { ReactComponent as ArrowDownloadRegular } from "../../../assets/svg/ArrowDownloadRegular.svg";
import { ReactComponent as ArrowForwardRegular } from "../../../assets/svg/ArrowForwardRegular.svg";
import { ReactComponent as ArrowReplyRegular } from "../../../assets/svg/ArrowReplyRegular.svg";
import { ReactComponent as DeleteRegular } from "../../../assets/svg/DeleteRegular.svg";
import { ReactComponent as MoreHorizontalRegular } from "../../../assets/svg/MoreHorizontalRegular.svg";
import { ReactComponent as PrintRegular } from "../../../assets/svg/PrintRegular.svg";

export default function EmailDetailThread({
  sender,
  to,
  body_preview,
  bcc,
  cc,
  mail_id,
  received_date_time,
  emailThreadBody,
  toggleThreadHandler,
  isOpened,
  iconStyling,
}) {
  // for more actions
  const [moreOpen, setMoreOpen] = useState(false);
  const emailMorePrimary = [
    {
      label: "Reply",
      icon: <ArrowReplyRegular style={iconStyling} />,
    },
    {
      label: "Forward",
      icon: <ArrowForwardRegular style={iconStyling} />,
    },
    {
      label: "Delete",
      icon: <DeleteRegular style={iconStyling} />,
    },
  ];

  const emailMoreSecondary = [
    {
      label: "Print",
      icon: <PrintRegular style={iconStyling} />,
    },
    {
      label: "Download",
      icon: <ArrowDownloadRegular style={iconStyling} />,
    },
  ];

  // const EmailMoreActions = () => {
  //   return (
  //     <div className=" text-gray-600 divide-y divide-gray-100 w-40">
  //       <div>
  //         {emailMorePrimary?.map((primary, index) => {
  //           return (
  //             <div
  //               className="rounded-md flex items-center space-x-2 cursor-pointer w-full hover:bg-gray-50 p-2"
  //               key={index}
  //             >
  //               <span>{primary?.icon}</span>
  //               <span style={{ fontSize: "13px" }}>{primary?.label}</span>
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <div>
  //         {emailMoreSecondary?.map((secondary, index) => {
  //           return (
  //             <div
  //               className="p-2 rounded-md space-x-2 cursor-pointer w-full hover:bg-gray-50"
  //               key={index}
  //             >
  //               <span>{secondary?.icon}</span>
  //               <span style={{ fontSize: "13px" }}>{secondary?.label}</span>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      <div>
        <div
          className={`${
            !isOpened && "hover:bg-gray-100"
          } mt-2 border border-gray-200 `}
        >
          <div className="py-4">
            <div className="flex items-center justify-between px-4 w-full">
              <div
                className="flex flex-row space-x-3 w-full"
                onClick={() => toggleThreadHandler(mail_id)}
              >
                <div>
                  <Avatar size={35}>
                    {sender?.emailAddress?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
                <div className="flex flex-col text-gray-700">
                  <div style={{ fontSize: "16px" }}>
                    {sender?.emailAddress?.name}
                  </div>
                  {isOpened && (
                    <div
                      className=" text-gray-500 line-clamp-1, font-light"
                      style={{ fontSize: "13px" }}
                    >
                      <div>
                        {to?.length > 0 && (
                          <div>
                            <span>To:</span>
                            <span>
                              {" "}
                              {to?.map((item, index) => (
                                <span key={index}>
                                  {item?.emailAddress?.name + "; "}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        {cc?.length > 0 && (
                          <div>
                            <span>CC:</span>
                            <span>
                              {" "}
                              {cc?.map((item, i) => (
                                <span key={i}>
                                  {item?.emailAddress?.name + "; "}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        {bcc?.length > 0 && (
                          <div>
                            <span>BCC:</span>
                            <span>
                              {bcc?.map((item, i) => (
                                <span key={i}>
                                  {item?.emailAddress?.name + "; "}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {!isOpened && (
                    <div
                      className=" text-gray-500 line-clamp-1 font-light"
                      style={{ fontSize: "13px" }}
                    >
                      {body_preview ?? "N/A"}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2 items-end w-64">
                {isOpened && (
                  <div className="flex flex-row space-x-2">
                    <Tooltip title={"Reply"} color={"#fff"}>
                      <span className="cursor-pointer p-1 hover:bg-gray-100">
                        <ArrowReplyRegular style={iconStyling} />
                      </span>
                    </Tooltip>
                    <Tooltip title={"Forward"} color={"#fff"}>
                      <span className="cursor-pointer p-1 hover:bg-gray-100">
                        <ArrowForwardRegular style={iconStyling} />
                      </span>
                    </Tooltip>
                    {/* <Tooltip
                      title={"More Actions"}
                      color={"#fff"}
                      className=" text-gray-500 line-clamp-1, font-light"
                      style={{ fontSize: "13px" }}
                    > */}
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
                    {/* </Tooltip> */}
                  </div>
                )}
                <div className="text-gray-500 text-xs tracking-wide">
                  {moment(received_date_time).format("llll")}
                </div>
              </div>
            </div>
          </div>

          {isOpened && (
            <div className="flex flex-col">
              <div
                className=" p-4 dark:bg-[#2C323B]"
                dangerouslySetInnerHTML={{
                  __html: emailThreadBody?.content?.replace(
                    "href",
                    "target='_blank' href"
                  ),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
