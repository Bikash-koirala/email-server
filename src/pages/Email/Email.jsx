import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/email.css";
import InboxEmails from "../../common/components/Emails/InboxEmails";
import IconWrapper from "../../common/components/Icon";
import { updateIsAllEmailSelected } from "../../store/ribbon";
import { selectAllEmailSelected } from "../../store/ribbon/selectors";
import { ReactComponent as CheckmarkCircleFilled } from "../../assets/svg/CheckmarkCircleFilled.svg";
import { ReactComponent as CheckmarkCircleRegular } from "../../assets/svg/CheckmarkCircleRegular.svg";

export default function Email() {
  const dispatch = useDispatch();
  const isAllEmailSelected = useSelector(selectAllEmailSelected);
  const handleAllEmailSelect = () => {
    dispatch(updateIsAllEmailSelected());
  };
  return (
    <div className="w-full h-full overflow-hidden">
      {/* header tab */}
      <div className="flex px-3 items-center border-b border-gray-300 dark:border-gray-600 justify-between w-full">
        {/* inbox tabs */}
        <div className="flex space-x-4 w-full items-center pl-1">
          <div className="py-2 w-full flex items-center">
            {/* <div className="flex space-x-2 items-center justify-center">
                  <div>
                    <AreaChart />
                  </div>
                </div> */}
            {/* <div className="flex flex-col justify-center align-center"> */}
            <IconWrapper
              icon={
                isAllEmailSelected ? (
                  <CheckmarkCircleFilled
                    style={{
                      color: "#0078d4",
                    }}
                  />
                ) : (
                  <CheckmarkCircleRegular />
                )
              }
              onClick={handleAllEmailSelect}
              style={{
                cursor: "pointer",
              }}
            />
            <div className="font-semibold md:text-2xl text-xl text-gray-500 dark:text-gray-300 pl-2">
              Inbox
            </div>
            {/* <div
                    className="flex text-gray-400"
                    style={{ fontSize: "13px" }}
                  >
                    <span className="font-semibold">560</span>
                    <span className="ml-1">Message</span>
                    {","}
                    <span className="font-semibold">120</span>
                    <span className="ml-1">Unread</span>
                  </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
      <InboxEmails />
    </div>
  );
}
