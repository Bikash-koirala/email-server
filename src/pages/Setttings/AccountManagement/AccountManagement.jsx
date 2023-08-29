import React, { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import AccountCard from "../../../common/components/AccountCard/AccountCard";
import OutlookImg from "../../../assets/images/outlook.png";
import Auth from "../../../common/apis/Auth";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      img: OutlookImg,
      connected: Auth.getFromLocalStorage("mail_boxes_list")?.length > 0,
    },
  ]);

  const handleDisconnect = () => {
    Auth.removeMailboxes();
    setAccounts([
      {
        id: 1,
        img: OutlookImg,
        connected: false,
      },
    ]);
    window.location.reload();
  };

  return (
    <>
      <div>
        <div className="flex items-center space-x-2 md:text-sm text-xs border-b border-gray-200 dark:border-gray-600 p-3">
          <span className=" text-red-500 text-lg mb-2">
            <QuestionCircleOutlined />
          </span>
          <span className="text-gray-400 ">
            You can now connect your multiple accounts and get the most out of
            it!
          </span>
        </div>

        <div className="md:p-7 p-3">
          {/* account card */}
          <div className="grid lg:grid-cols-4 w-full md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {accounts?.map((account, index) => {
              return (
                <AccountCard
                  {...account}
                  key={index}
                  handleDisconnect={handleDisconnect}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
