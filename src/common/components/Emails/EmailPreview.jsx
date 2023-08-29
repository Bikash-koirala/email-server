import moment from "moment";
import React from "react";

export const emailPreview = (emailDetail) => {
  return (
    <div className="overflow-y-auto email-detail-inner-container px-1" style={{
      height: 'auto !important'
    }}>
        <div className="py-4">
          <div className="flex items-center justify-between px-4 w-full">
            <div className="flex flex-row space-x-3 w-full">
              <div className="flex flex-col text-gray-700">
                <div
                  style={{
                    padding: 0,
                    height: "100% !important",
                    margin: "0px auto !important",
                    width: "100% !important",
                  }}
                >
                  {/* padding: 0px; height: 100% !important; margin: 0px auto !important; width: 100% !important; */}
                  <div style={{ fontSize: "13px" }}>
                    <b>From:</b> {emailDetail?.from?.emailAddress?.name} &lt;
                    {emailDetail?.from?.emailAddress?.address}&gt;
                    <br />
                    <b>Sent:</b>{" "}
                    {moment(emailDetail?.sentDateTime).format("llll")}
                    <br />
                    <b>To: </b>
                    {emailDetail?.toRecipients?.length > 0 && (
                      <span>
                        {emailDetail?.toRecipients?.map((item, index) => (
                          <span key={index}>
                            {item?.emailAddress?.name} &lt;
                            {item?.emailAddress?.address}&gt;
                          </span>
                        ))}
                      </span>
                    )}
                    <br />
                    <b>Subject:</b> {emailDetail?.subject}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* email body preview */}
          <div className="flex flex-col items-center">
            <div
              className="dark:bg-[#2C323B] w-full px-4"
              dangerouslySetInnerHTML={{
                __html: emailDetail?.body?.content.replace(
                  "href",
                  "target='_blank' href"
                ),
              }}
            />
          </div>
    </div>
  );
};
