import { Button, notification, Tooltip } from "antd";
import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import DeleteModal from "../DeleteModal/DeleteModal";

export default function AccountCard({ id, img, connected, handleDisconnect }) {
  const [loading, setLoading] = useState(false);
  // for removing the account
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // for deleting the mail we need slug/id
  const [deleteId, setDeleteId] = useState(null);

  // const connectHandler = async () => {
  //   try {
  //     setLoading(true);
  //     // const data = await Mailbox.saveMailboxToken();
  //     window.location.href = config.microsoftRedirectUri
  //   } catch (error) {
  //     alert(error.message)
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // on mail delete
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setDeleteModal(false);
      setConfirmLoading(false);
      notification.success({
        message: "Account Removed Successfully",
        description: "Your can reconnect with us.",
        placement: "top",
      });
    }, 2000);
  };

  return (
    <>
      {/* delete modal */}
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        confirmLoading={confirmLoading}
        handleOk={handleOk}
        deleteAlertTitle="Are you sure you want to remove this account?"
      />

      <div className="account-card-container relative w-full h-full p-3 rounded-md border dark:border-gray-800 border-gray-100  cursor-pointer">
        {/* image container */}
        <div className="h-16 w-16 mx-auto bg-white dark:bg-gray-600 rounded-full p-1 shadow-lg">
          <img
            src={img}
            alt="outlook_img"
            className="object-cover h-full w-full"
          />
        </div>
        {/* button container */}
        <div className="mt-6 flex items-center justify-center">
          {connected ? (
            <Button onClick={handleDisconnect}>Disconnect</Button>
          ) : (
            <a
              // href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=d1b2c0e5-39ef-4587-8f50-980a637d050e&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_mode=query&scope=offline_access%20user.read%20mail.read%20mail.send%20mail.readwrite&session_state=1234"
              href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=d1b2c0e5-39ef-4587-8f50-980a637d050e&response_type=code&redirect_uri=https%3A%2F%2Fes-dev.braintip.ai%2Fcallback&response_mode=query&scope=offline_access%20user.read%20mail.read%20mail.send%20mail.readwrite&session_state=1234"
              type="primary"
            >
              Connect
            </a>
          )}
        </div>

        {/* deleting the account */}
        <div className="delete-account-container">
          <Tooltip placement="top" title="Remove Account">
            <div
              className="delete-account absolute -top-4 -right-4"
              onClick={() => {
                setDeleteModal(true);
                setDeleteId(id);
              }}
            >
              <div>
                <DeleteOutlined className="mb-2" />
              </div>
            </div>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
