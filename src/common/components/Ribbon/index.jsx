import { ReactComponent as ArchiveRegular } from "../../../assets/svg/ArchiveRegular.svg";
import { ReactComponent as ArrowForwardRegular } from "../../../assets/svg/ArrowForwardRegular.svg";
import { ReactComponent as ArrowReplyAllRegular } from "../../../assets/svg/ArrowReplyAllRegular.svg";
import { ReactComponent as ArrowReplyRegular } from "../../../assets/svg/ArrowReplyRegular.svg";
import { ReactComponent as DeleteRegular } from "../../../assets/svg/DeleteRegular.svg";
import { ReactComponent as FolderArrowRightRegular } from "../../../assets/svg/FolderArrowRightRegular.svg";
import { ReactComponent as FolderRegular } from "../../../assets/svg/FolderRegular.svg";
import { ReactComponent as MailReadRegular } from "../../../assets/svg/MailReadRegular.svg";
import { ReactComponent as MailRegular } from "../../../assets/svg/MailRegular.svg";
import { ReactComponent as SpeakerMuteRegular } from "../../../assets/svg/SpeakerMuteRegular.svg";
import { Space } from "antd";
import qs from "qs";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveEmail, toggleEmailRead } from "../../../store/email";
import {
  selectCurrentFolderId,
  selectEmailFolders,
  selectEmailPayloadForMultiTab,
} from "../../../store/email/selectors";
import { addMultiTask } from "../../../store/multitask";
import {
  selectAllEmailSelected,
  selectSelectedEmailLists,
} from "../../../store/ribbon/selectors";
import IconWrapper from "../Icon";
import RibbonButton from "./RibbonButton";
import { truncateString } from "../../../utils/truncate";
import { REPLY_MODE } from "../../../constants";
import { selectCurrentTaskId } from "../../../store/multitask/selectors";

const Ribbon = () => {
  const dispatch = useDispatch();
  const allEmailSelected = useSelector(selectAllEmailSelected);
  const selectedEmails = useSelector(selectSelectedEmailLists);
  const disableCommonButtons = !allEmailSelected && selectedEmails?.length <= 0;
  const emailFolders = useSelector(selectEmailFolders);
  const currentFolderId = useSelector(selectCurrentFolderId);
  const emailPayload = useSelector(selectEmailPayloadForMultiTab);
  const currentTaskId = useSelector(selectCurrentTaskId);
  if (!emailFolders) return null;
  const archiveFolder = emailFolders?.find(
    (fld) => fld.display_name == "Archive"
  );
  const currentFolder = emailFolders?.find((fld) => fld.id == currentFolderId);

  const disableReplyAndForward =
    !Boolean(!!emailPayload?.subject && currentTaskId === "primaryEmailBoard") &&
    Boolean(selectedEmails?.length !== 1 || allEmailSelected);

  const getMenuIcon = (menu) => {
    if (menu === "Archive") return <ArchiveRegular />;
    if (menu === "Deleted Items") return <DeleteRegular />;
    return <FolderRegular />;
  };
  const moveItems = emailFolders?.reduce((acc, curr, _idx) => {
    if (
      curr.display_name === "Outbox" ||
      curr.display_name === "Sent Items" ||
      curr.display_name === "Drafts" ||
      curr.display_name === "Inbox" ||
      curr.display_name === "Junk Email"
    ) {
      return acc;
    } else {
      acc.push({
        label: curr.display_name,
        key: `destination_id=${curr.folder_id}&&folder_id=${curr.id}`,
        disabled:
          disableCommonButtons ||
          currentFolder.display_name === curr.display_name,
        icon: (
          <IconWrapper
            icon={getMenuIcon(curr.display_name)}
            wrapperClass={`mr-2.5 btn-${curr.display_name.toLowerCase()}`}
          />
        ),
      });
    }
    return acc;
  }, []);
  const deleteFolder =
    emailFolders?.find((ef) => ef.display_name === "Deleted Items") || {};
  const deleteItems = [
    {
      label: "Delete",
      key: `destination_id=${deleteFolder.folder_id}&&folder_id=${deleteFolder.id}&&display_name=${deleteFolder.display_name}`,
      icon: <IconWrapper icon={<DeleteRegular />} wrapperClass="mr-2.5" />,
      disabled: disableCommonButtons,
    },
    {
      label: "Ignore",
      key: "2",
      icon: (
        <IconWrapper
          icon={
            <SpeakerMuteRegular
              style={{
                color: `rgb(164, 38, 44)`,
              }}
            />
          }
          wrapperClass="mr-2.5"
        />
      ),
      disabled: true,
    },
  ];

  const handleMenuClick = (ev) => {
    const key = ev.key;
    const { destination_id, folder_id, ...props } = qs.parse(key);
    if (props?.display_name === currentFolder.display_name) {
      dispatch(
        moveEmail({ data: { destination_id, folder_id }, isTrash: true })
      );
      return;
    }
    dispatch(moveEmail({ data: { destination_id, folder_id } }));
  };

  const handleMoveArchive = () => {
    const destination_id = archiveFolder.id;
    const folder_id = archiveFolder.id;
    dispatch(moveEmail({ data: { destination_id, folder_id } }));
  };

  const deleteMenuProps = {
    items: deleteItems,
    onClick: handleMenuClick,
  };

  const moveMenuProps = {
    items: moveItems,
    onClick: handleMenuClick,
  };

  const handleNewEmail = () => {
    dispatch(addMultiTask({ taskHeading: "No Subject" }));
  };

  const handleReadUnread = () => {
    dispatch(toggleEmailRead());
  };

  const handleForward = () => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(emailPayload.subject),
        mailId: emailPayload.mailId,
        taskMode: REPLY_MODE.forward,
      })
    );
  };

  const handleReply = () => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(emailPayload.subject),
        mailId: emailPayload.mailId,
        taskMode: REPLY_MODE.reply,
      })
    );
  };

  const handleReplyAll = () => {
    dispatch(
      addMultiTask({
        taskHeading: truncateString(emailPayload.subject),
        mailId: emailPayload.mailId,
        taskMode: REPLY_MODE.replyAll,
      })
    );
  };

  //Ribbon menu logics

  return (
    <div className="flex space-x-4 h-10 mb-2 text-stone-800 bg-white shadow-md rounded-sm pl-1.5	pr-1.5">
      <Space direction="horizontal">
        <RibbonButton
          buttonLabel="New Email"
          buttonIcon={MailRegular}
          tooltip={
            <React.Fragment>
              <p>New Email</p>
              <p>Create a new email message.</p>
            </React.Fragment>
          }
          wrapperClass="compose-email"
          onClick={handleNewEmail}
        />
        <RibbonButton
          buttonIcon={DeleteRegular}
          tooltip={
            <React.Fragment>
              <p>Delete this message.</p>
            </React.Fragment>
          }
          wrapperClass="button-delete tray-button"
          dropDownMenu={deleteMenuProps}
          buttonLabel="Delete"
          disabled={disableCommonButtons}
        />
        <RibbonButton
          buttonIcon={ArchiveRegular}
          tooltip={
            <React.Fragment>
              <p>Move this message to your archive folder.</p>
            </React.Fragment>
          }
          wrapperClass="button-archive tray-button"
          buttonLabel="Archive"
          onClick={handleMoveArchive}
          disabled={
            disableCommonButtons || currentFolder.display_name === "Archive"
          }
        />
        <RibbonButton
          buttonIcon={FolderArrowRightRegular}
          tooltip={
            <React.Fragment>
              <p>Move to a folder.</p>
            </React.Fragment>
          }
          wrapperClass="button-move tray-button"
          dropDownMenu={moveMenuProps}
          buttonLabel="Move to"
          // extraContent
          disabled={disableCommonButtons}
        />
        <span className="vertical-line-spacer" />
        <RibbonButton
          buttonIcon={ArrowReplyRegular}
          tooltip={
            <React.Fragment>
              <p>Reply to this message.</p>
            </React.Fragment>
          }
          wrapperClass="button-reply tray-button"
          buttonLabel="Reply"
          disabled={disableReplyAndForward}
          onClick={handleReply}
        />
        <RibbonButton
          buttonIcon={ArrowReplyAllRegular}
          tooltip={
            <React.Fragment>
              <p>Reply all to this message.</p>
            </React.Fragment>
          }
          wrapperClass="button-reply tray-button"
          buttonLabel="Reply All"
          disabled={disableReplyAndForward}
          onClick={handleReplyAll}
        />
        <RibbonButton
          buttonIcon={ArrowForwardRegular}
          tooltip={
            <React.Fragment>
              <p>Forward this message.</p>
            </React.Fragment>
          }
          wrapperClass="button-forward tray-button"
          buttonLabel="Forward"
          disabled={disableReplyAndForward}
          onClick={handleForward}
        />
        <span className="vertical-line-spacer" />
        <RibbonButton
          buttonIcon={MailReadRegular}
          tooltip={
            <React.Fragment>
              <p>Mark this message as read or unread.</p>
            </React.Fragment>
          }
          buttonLabel="Read / Unread"
          wrapperClass="tray-button"
          disabled={disableCommonButtons}
          onClick={handleReadUnread}
        />
      </Space>
    </div>
  );
};

export default Ribbon;
