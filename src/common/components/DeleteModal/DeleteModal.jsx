import React from "react";
import { Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function DeleteModal({
  deleteModal,
  setDeleteModal,
  handleOk,
  confirmLoading,
  deleteAlertTitle,
}) {
  const modalTitle = () => {
    return (
      <>
        <div className="flex space-x-3 items-center text-[#e83030] dark:text-white">
          <div className="mb-0.5">
            <DeleteOutlined />
          </div>
          <div>Delete?</div>
        </div>
      </>
    );
  };

  return (
    <>
      <Modal
        title={modalTitle()}
        open={deleteModal}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setDeleteModal(false)}
      >
        <p>{deleteAlertTitle}</p>
      </Modal>
    </>
  );
}
