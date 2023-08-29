import React, { useState } from "react";
import { Menu, Layout, Collapse } from "antd";
import BrainTipImage from "../../assets/images/braintipimage.png";
import BrainTipIcon from "../../assets/images/braintipicon.png";
import { selectTheme } from "../../store/appMode/selectors";
import { useSelector, useDispatch } from "react-redux";
import { resetRibbonActions } from "../../store/ribbon";
import {
  updateCurrentEmailFolder,
  createNewMailFolder,
} from "../../store/email";
import { ReactComponent as FolderAddRegular } from "../../assets/svg/FolderAddRegular.svg";

export default function Sidebar({
  collapsed,
  sidebarOptions,
  defaultSelected,
}) {
  const dispatch = useDispatch();
  const currTheme = useSelector(selectTheme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccordinoClosed, setIsAccordioClosed] = useState(false);

  const [folderInput, setFolderInput] = useState("");

  const handleMenuClick = (ev) => {
    const folder_id = ev.key.split("-")[1];
    if (!isNaN(folder_id)) {
      dispatch(updateCurrentEmailFolder(folder_id));
    }
    dispatch(resetRibbonActions());
  };

  const folderCreateHandler = (e) => {
    e.preventDefault();
    dispatch(
      createNewMailFolder({
        display_name: folderInput,
        is_hidden: false,
      })
    );
    setFolderInput("");
    setIsAccordioClosed(false);
  };

  return (
    <>
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="h-14 w-full flex items-center justify-center dark:bg-Dark1"
          style={{
            background: "#0e205a",
          }}
        >
          {!collapsed ? (
            <img
              src={BrainTipImage}
              alt="braintip"
              className="px-4 pt-2"
              style={{
                width: "74%",
              }}
            />
          ) : (
            <img
              src={BrainTipIcon}
              alt="braintip"
              className="object-cover h-10 w-10"
            />
          )}
        </div>
        {/* sidebar menu */}
        <div
          className={`${
            currTheme === "DARK" && "SETDARKBACKGROUND"
          } dashboard-sidebar-outer border-r border-gray-100 dark:border-gray-700`}
        >
          <div className="dashboard-sidebar-inner dark:bg-[#1D2028]">
            {/* <div
              className="compose-email-button "
              onClick={() =>
                dispatch(addMultiTask({ taskHeading: "No Subject" }))
              }
            >
              <span>
                <Mail20Regular />
              </span>
              <span
                className={`${
                  !collapsed ? "show-compose-text" : "hide-compose-text"
                }`}
              >
                Compose
              </span>
            </div> */}
            <div className="mt-3">
              <Menu
                defaultSelectedKeys={[defaultSelected]}
                // defaultOpenKeys={width < 1200 ? [""] : ["favourites", "folders"]}
                mode="inline"
                items={sidebarOptions}
                onClick={handleMenuClick}
              />

              {/* <Button>Create new folder</Button>
              <Input.Group compact>
                <Input
                  style={{
                    width: "calc(100% - 110px)",
                  }}
                />
                <Button type="primary">Submit</Button>
              </Input.Group> */}
              <div className="px-4">
                <Collapse
                  bordered={false}
                  onChange={() => setIsAccordioClosed(!isAccordinoClosed)}
                  // defaultActiveKey={folderActiveKey}
                  accordion={isAccordinoClosed}
                  expandIcon={() => (
                    <FolderAddRegular
                      style={{
                        height: "22px",
                        width: "22px",
                        color: "#4a5568",
                      }}
                    />
                  )}
                >
                  <Collapse.Panel header={!collapsed ? "Create Folder" : ""}>
                    <form
                      onSubmit={folderCreateHandler}
                      className="flex items-center justify-center space-x-2 "
                    >
                      <input
                        type="text"
                        value={folderInput}
                        onChange={(e) => setFolderInput(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded block w-full p-1.5 focus:border-[#0f6cbd] focus:outline-none"
                      />
                      <button type="submit" className="text-sm text-[#0f6cbd]">
                        Save
                      </button>
                    </form>
                  </Collapse.Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </Layout.Sider>

      {/* <Modal
        title="Compose Email"
        open={isModalOpen}
        onOk={handleOk}
        footer={null}
        maskClosable={false}
        onCancel={handleCancel}
        width={800}
      >
        <EmailComposeBox />
      </Modal> */}
    </>
  );
}
