import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmailDetailsBackup from "../../../pages/EmailDetail/EmailDetailsBackup";
import {
  removeCurrentTask,
  updateCurrentTask,
  updateCurrentTaskMode,
} from "../../../store/multitask";
import { selectMultiTask } from "../../../store/multitask/selectors";
import EmailComposeBox from "../EmailCompose/EmailComposeBox";

const MultiTabEmails = () => {
  const multitask = useSelector(selectMultiTask);
  const [items, setItems] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (multitask?.length > 0) {
      const tempItems = multitask?.map((mt) => {
        return {
          label: mt.taskHeading,
          key: mt.taskId,
          children:
            mt.taskId === "primaryEmailBoard" ? (
              <>
                <EmailDetailsBackup />
              </>
            ) : (
              <EmailComposeBox taskId={mt.taskId} />
            ),
          closable: mt.taskId === "primaryEmailBoard" ? false : true,
        };
      });
      setItems(tempItems);
      setActiveKey(tempItems[tempItems.length - 1].key);
      dispatch(updateCurrentTask(tempItems[tempItems.length - 1].key));
    }
  }, [multitask]);

  const onChange = (key) => {
    dispatch(updateCurrentTaskMode(key));
    dispatch(updateCurrentTask(key));
    setActiveKey(key);
  };

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
      dispatch(updateCurrentTask(key));
    }
    dispatch(removeCurrentTask(targetKey));
    setItems(newPanes);
  };

  return (
    <Tabs
      className={items?.length === 1 ? "remove-tab-bar" : ""}
      hideAdd
      onChange={onChange}
      activeKey={activeKey}
      type="editable-card"
      onEdit={remove}
      items={items}
      tabPosition="bottom"
    />
  );
};

export default MultiTabEmails;
