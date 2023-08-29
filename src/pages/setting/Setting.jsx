import React from "react";
import { Button, Card } from "antd";
import MicrosoftIcon from "../../assets/images/MiccosoftIcon.png";
import appConfig from "../../config";
import Mailbox from "../../common/apis/Mailbox";

const Setting = () => {
  const handleConnectMicrosoft = async () => {
    const res = await Mailbox.connectMailBox(appConfig.microsoftRedirectUri);
    console.log(res);
  };
  return (
    <div className="site-card-border-less-wrapper">
      <Card
        title="Microsoft account"
        // bordered={false}
        style={{
          width: 400,
        }}
      >
        <p>you can configure your microsoft account</p>
        <div className="pt-4 relative">
          <Button
            className="w-full"
            size="large"
            onClick={handleConnectMicrosoft}
            style={{
              display: "flex !important",
              flexWrap: "wrap",
            }}
            // href={appConfig.microsoftRedirectUri}
          >
            <img
              src={MicrosoftIcon}
              alt="microsoft_icon"
              width={24}
              height={24}
            />{" "}
            Connect With Microsoft
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Setting;
