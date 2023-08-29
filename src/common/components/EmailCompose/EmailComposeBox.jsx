import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import "jodit";
import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";
import { Button, Form, Input, message, Upload } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeCurrentTask,
  updateMultiTaskHeading,
} from "../../../store/multitask";
import { REPLY_MODE } from "../../../constants";

import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import { UploadOutlined } from "@ant-design/icons";
import { ReactComponent as SendRegular } from "../../../assets/svg/SendRegular.svg";
import { selectCurrentEmailDetails } from "../../../store/email/selectors";
import config from "../../../config";
import { selectMultiTask } from "../../../store/multitask/selectors";
import { emailPreview } from "../Emails/EmailPreview";

const copyStringToClipboard = function (str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const facilityMergeFields = [
  "FacilityNumber",
  "FacilityName",
  "Address",
  "MapCategory",
  "Latitude",
  "Longitude",
  "ReceivingPlant",
  "TrunkLine",
  "SiteElevation",
];
const inspectionMergeFields = ["InspectionCompleteDate", "InspectionEventType"];
const createOptionGroupElement = (mergeFields, optionGrouplabel) => {
  let optionGroupElement = document.createElement("optgroup");
  optionGroupElement.setAttribute("label", optionGrouplabel);
  for (let index = 0; index < mergeFields.length; index++) {
    let optionElement = document.createElement("option");
    optionElement.setAttribute("className", "merge-field-select-option");
    optionElement.setAttribute("value", mergeFields[index]);
    optionElement.text = mergeFields[index];
    optionGroupElement.appendChild(optionElement);
  }
  return optionGroupElement;
};
const buttons = [
  "undo",
  "redo",
  "|",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "|",
  "superscript",
  "subscript",
  "|",
  "align",
  "|",
  "ul",
  "ol",
  "outdent",
  "indent",
  "|",
  "font",
  "fontsize",
  "brush",
  "paragraph",
  "|",
  "image",
  "link",
  "table",
  "|",
  "hr",
  "eraser",
  "copyformat",
  "|",
  "fullsize",
  "selectall",
  "print",
  "|",
  "source",
  "|",
  {
    name: "insertMergeField",
    tooltip: "Insert Merge Field",
    iconURL: "images/merge.png",
    popup: (editor, current, self, close) => {
      function onSelected(e) {
        let mergeField = e.target.value;
        if (mergeField) {
          editor.selection.insertNode(
            editor.create.inside.fromHTML("{{" + mergeField + "}}")
          );
        }
      }
      let divElement = editor.create.div("merge-field-popup");

      let labelElement = document.createElement("label");
      labelElement.setAttribute("class", "merge-field-label");
      labelElement.text = "Merge field: ";
      divElement.appendChild(labelElement);

      let selectElement = document.createElement("select");
      selectElement.setAttribute("class", "merge-field-select");
      selectElement.appendChild(
        createOptionGroupElement(facilityMergeFields, "Facility")
      );
      selectElement.appendChild(
        createOptionGroupElement(inspectionMergeFields, "Inspection")
      );
      selectElement.onchange = onSelected;
      divElement.appendChild(selectElement);

      return divElement;
    },
  },
  {
    name: "copyContent",
    tooltip: "Copy HTML to Clipboard",
    iconURL: "images/copy.png",
    exec: function (editor) {
      let html = editor.value;
      copyStringToClipboard(html);
    },
  },
];

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: true,
  statusbar: false,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  theme: "",
  //defaultActionOnPaste: "insert_clear_html",
  buttons: buttons,
  uploader: {
    insertImageAsBase64URI: true,
  },
  width: 800,
  height: 500,
};

const EmailComposeBox = ({ taskId }) => {
  const [data, setData] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emails, setEmails] = useState([]);
  const [ccEmails, setCCEmails] = useState([]);
  const [bccEmails, setBCCEmails] = useState([]);
  const [focused, setFocused] = React.useState(false);
  const [isBccOpened, setIsBccOpened] = useState(false);

  const emailDetail = useSelector(selectCurrentEmailDetails);
  const allTasks = useSelector(selectMultiTask);
  const currentTask = allTasks.find((at) => at.taskId === taskId);

  const onFinish = (values) => {
    let email_data = new FormData();
    email_data.append("to", values.to);
    email_data.append("cc", values?.cc);
    email_data.append("subject", values.subject);
    email_data.append(
      "id",
      currentTask.taskMode === REPLY_MODE.noAction ? "" : emailDetail.id
    );
    email_data.append("bcc", values?.bcc);
    email_data.append("body", data);

    email_data.append(
      "attachment",
      values?.attachment?.fileList[0]?.originFileObj
    );

    if (values) {
      axios
        .post(
          `${config.apiBaseUrl}/integration/compose/mail`,
          email_data

          //   {
          //     to: emails.join(","),
          //     cc: values?.cc?.join(","),
          //     id: currentTask.taskMode === REPLY_MODE.noAction ? "" : emailDetail.id,
          //     bcc: values?.bcc?.join(","),
          //     subject: values.subject,
          //     body: data,
          //     attachment: values?.attachment?.fileList[0]?.originFileObj,
          //   }
        )

        .then((response) => {
          message.success("Email Sent successfully!");
          dispatch(removeCurrentTask(taskId));
        })
        .then(navigate("/email"))

        .catch((error) => {
          message.error("Unable to send email!");
        });
    }
  };

  const updateSubjectChange = (ev) => {
    dispatch(
      updateMultiTaskHeading({
        taskId,
        taskHeading: ev.target.value,
      })
    );
  };

  useEffect(() => {
    if (currentTask.taskMode === REPLY_MODE.replyAll) {
      setEmails([emailDetail?.sender?.emailAddress?.address]);
    }
  }, []);

  useEffect(() => {
    if (!!emailDetail && currentTask?.taskMode !== REPLY_MODE.noAction) {
      setData(ReactDOMServer.renderToStaticMarkup(emailPreview(emailDetail)));
    }
  }, []);

  // const formLabelManagement = (label) => {
  //   return (
  //     <div className="h-full mt-2 w-full bg-gray-100 flex items-center justify-center p-2">
  //       {label}
  //     </div>
  //   );
  // };

  const iconStyling = {
    height: "19px",
    width: "19px",
  };

  return (
    <div>
      <div
        className="App"
        // style={{ maxWidth: editorConfig.width, margin: "0 auto" }}
      >
        <Form
          form={form}
          name="compose email"
          initialValues={{
            remember: true,
          }}
          layout="horizontal"
          requiredMark={false}
          onFinish={onFinish}
        >
          {/* input to */}
          <div className="flex flex-col space-y-3 md:p-4 p-2">
            <div className="flex space-x-3 items-center justify-center to_receiptent">
              <div className="w-full">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-9 text-xs flex items-center justify-center px-3 bg-gray-100 rounded w-12">
                    TO
                  </div>
                  <div className="w-full">
                    <Form.Item
                      // label={formLabelManagement("To")}
                      name="to"
                      rules={[
                        {
                          required: true,
                          message: "Required!",
                        },
                      ]}
                      initialValue={
                        currentTask.taskMode === REPLY_MODE.reply
                          ? emailDetail?.sender?.emailAddress?.address
                          : ""
                      }
                      style={{
                        display: "inline-block",
                        width: "calc(100% - 0px)",
                      }}
                    >
                      {/* <Input placeholder="To" /> */}
                      <ReactMultiEmail
                        placeholder="Email"
                        emails={emails}
                        onChange={(_emails) => {
                          setEmails(_emails);
                        }}
                        autoFocus={true}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        getLabel={(email, index, removeEmail) => {
                          return (
                            <div data-tag key={index}>
                              <div data-tag-item>{email}</div>
                              <span
                                data-tag-handle
                                onClick={() => removeEmail(index)}
                              >
                                ×
                              </span>
                            </div>
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div
                className="text-sm p-2 cursor-pointer hover:bg-gray-100 text-[#0F6CBD]"
                onClick={() => setIsBccOpened(!isBccOpened)}
              >
                Bcc
              </div>
            </div>

            {/* input CC */}
            <div className="flex items-center justify-center space-x-2">
              <div className="h-9 text-xs flex items-center justify-center px-3 bg-gray-100 rounded w-12">
                CC
              </div>
              <div className="w-full">
                {" "}
                <Form.Item
                  name="cc"
                  rules={[
                    {
                      required: false,
                      message: "!",
                    },
                  ]}
                >
                  <ReactMultiEmail
                    placeholder="CC"
                    emails={ccEmails}
                    onChange={(_emails) => {
                      setCCEmails(_emails);
                    }}
                    autoFocus={true}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    getLabel={(email, index, removeEmail) => {
                      return (
                        <div data-tag key={index}>
                          <div data-tag-item>{email}</div>
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      );
                    }}
                  />

                  {/* <Input placeholder="CC" /> */}
                </Form.Item>
              </div>
            </div>

            {/* BCC */}
            {isBccOpened && (
              <div className="flex items-center justify-center space-x-2">
                <div className="h-9 text-xs flex items-center justify-center px-3 bg-gray-100 rounded w-12">
                  BCC
                </div>
                <div className="w-full">
                  <Form.Item
                    name="bcc"
                    rules={[
                      {
                        required: false,
                        message: "!",
                      },
                    ]}
                  >
                    <ReactMultiEmail
                      placeholder="BCC"
                      emails={bccEmails}
                      onChange={(_emails) => {
                        setBCCEmails(_emails);
                      }}
                      autoFocus={true}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      getLabel={(email, index, removeEmail) => {
                        return (
                          <div data-tag key={index}>
                            <div data-tag-item>{email}</div>
                            <span
                              data-tag-handle
                              onClick={() => removeEmail(index)}
                            >
                              ×
                            </span>
                          </div>
                        );
                      }}
                    />
                    {/* <Input placeholder="BCC" /> */}
                  </Form.Item>
                </div>
              </div>
            )}

            <style jsx>{`
              .ant-collapse-header {
                padding: 0px !important;
              }

              .to_receiptent .ant-form-item {
                margin-bottom: 0px !important;
              }

              .react-multi-email {
                padding: 0.35em 0.5em !important;
              }
            `}</style>
            {/* subject */}
            <div>
              <Form.Item
                name="subject"
                rules={[
                  {
                    required: true,
                    message: "Required!",
                  },
                ]}
                initialValue={
                  Boolean(
                    currentTask.taskMode === REPLY_MODE.reply ||
                      currentTask.taskMode === REPLY_MODE.replyAll
                  )
                    ? "Re: " + emailDetail?.subject
                    : currentTask.taskMode === REPLY_MODE.forward
                    ? "Fwd: " + emailDetail?.subject
                    : ""
                }
              >
                <Input
                  placeholder="Add a Subject"
                  onChange={updateSubjectChange}
                />
              </Form.Item>
            </div>

            <div className="w-full">
              {/* <Form.Item> */}
              <JoditEditor
                value={data}
                config={editorConfig}
                onChange={(value) => setData(value)}
              />
              {/* </Form.Item> */}
            </div>
          </div>

          <div className="md:p-4 p-2 flex items-center justify-between">
            <div>
              <Form.Item name="attachment">
                <Upload
                  // accept=".txt, .csv"
                  showUploadList={true}
                  beforeUpload={(file) => {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                      console.log(e.target.result);
                    };
                    reader.readAsText(file);

                    // Prevent upload
                    return false;
                  }}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{ fontSize: "13px" }}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </div>
            <div className="">
              <Form.Item>
                {/* <Button type="primary">Save as Draft</Button> */}
                {/* <Button type="primary" htmlType="submit">
                  Send
                </Button> */}
                <button
                  type="submit"
                  className="bg-[#0E205A] hover:bg-[#11266c] flex items-center justify-center space-x-4 text-gray-300 rounded hover:shadow-lg transition-all duration-300 border p-2 px-4 tracking-wide"
                >
                  <span>Send</span>
                  <span>
                    <SendRegular
                      className="send-mail-button"
                      style={{
                        ...iconStyling,
                      }}
                    />
                  </span>
                </button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EmailComposeBox;
