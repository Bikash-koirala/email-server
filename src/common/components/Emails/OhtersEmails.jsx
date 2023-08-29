import React, { useState } from "react";
import MicrosoftBg from "../../../assets/images/MiccosoftIcon.png";
import { notification, Tooltip } from "antd";
import DeleteModal from "../DeleteModal/DeleteModal";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function OhtersEmails() {
  // for deleting the mail
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // for deleting the mail we need slug/id
  const [deleteId, setDeleteId] = useState(null);

  const emails = [
    {
      id: 1,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :)",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 2,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :) jflkads jfkljdasklfjklasdjklfjadklsjfkladsjklfj kljasdklfjkl asdjklfj klasdjfkljadsklfjkladsjfkljadskljf",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 3,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :)",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 4,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :)",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 2,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :) jflkads jfkljdasklfjklasdjklfjadklsjfkladsjklfj kljasdklfjkl asdjklfj klasdjfkljadsklfjkladsjfkljadskljf",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 3,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :)",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 4,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :)",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 2,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :) jflkads jfkljdasklfjklasdjklfjadklsjfkladsjklfj kljasdklfjkl asdjklfj klasdjfkljadsklfjkladsjfkljadskljf",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 3,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :)",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
    {
      id: 4,
      heading: "Sanil panicker in teams",
      body: "Sanil sent a message Two Adarsha's looks like he is confused :)",
      time: "8:15pm",
      organizationImage: MicrosoftBg,
    },
  ];

  // on mail delete
  const handleOk = () => {
    setConfirmLoading(true);
    console.log(deleteId);
    setTimeout(() => {
      setDeleteModal(false);
      setConfirmLoading(false);
      notification.success({
        message: "Mail Deleted Successfully",
        description: "You can view all the deleted mails on trash list.",
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
        deleteAlertTitle="Are you sure you want to remove this email?"
      />
      <div
        className="divide-y divide-gray-300 overflow-y-auto overflow-x-hidden"
        style={{ height: "590px" }}
      >
        {emails?.map((email, index) => {
          const { heading, body, organizationImage, time } = email;
          return (
            // redirecting to slug for detail
            <div key={index}>
              <Link
                to={"chekcing"}
                className="relative mail-container hover:shadow-lg hover:bg-gray-50 flex flex-row w-full justify-between space-x-4"
              >
                {/* organization image */}
                <div className="flex flex-row items-center space-x-4 p-3">
                  <img
                    src={organizationImage}
                    alt="organization_image"
                    className="h-8 w-8 object-cover"
                  />
                  <div className="flex flex-col space-y-1">
                    <div className="text-gray-900 line-clamp-1">{heading}</div>
                    <div className="text-gray-500 text-sm line-clamp-2">
                      {body}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row space-x-3 items-center justify-center">
                  <div className="w-24 text-sm text-gray-700 pr-2">{time}</div>

                  <Tooltip placement="right" title="Delete">
                    <div
                      className="h-full px-2 p-1 absolute right-2 top-0 text-gray-700 mail-delete-container"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(index);
                      }}
                    >
                      <button className="h-full">
                        <DeleteOutlined />
                      </button>
                    </div>
                  </Tooltip>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
