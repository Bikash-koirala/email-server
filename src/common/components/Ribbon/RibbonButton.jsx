import { ReactComponent as ChevronDownRegular } from "../../../assets/svg/ChevronDownRegular.svg";
import { Button, Divider, Dropdown, Space, Tooltip } from "antd";
import React from "react";
import IconWrapper from "../Icon";

const buttonStyle = {
  display: "flex",
  flexWrap: "wrap",
  borderRadius: 4,
};

const iconStyle = {
  marginRight: 5,
};

const RibbonButton = ({
  buttonIcon = "",
  buttonLabel = "",
  tooltip = "",
  dropDownMenu = "",
  onClick = () => {},
  wrapperClass = "",
  disabled = false,
  extraContent = false,
}) => {
  if (dropDownMenu?.items?.length > 0 && tooltip) {
    return extraContent ? (
      <Dropdown.Button
        menu={dropDownMenu}
        onClick={onClick}
        trigger={["click"]}
        className={`${wrapperClass ? wrapperClass : ""} tray-button-with-icon`}
        placement="bottomLeft"
        // disabled={disabled}
        dropdownRender={(menu) => (
          <div>
            {React.cloneElement(menu)}
            <Divider style={{ margin: 0 }} />
            <Space style={{ padding: 8 }}>
              <Button type="primary">Click me!</Button>
            </Space>
          </div>
        )}
        buttonsRender={([leftButton, rightButton]) => [
          <Tooltip
            title={tooltip}
            key="leftButton"
            placement="bottom"
            color="white"
          >
            {React.cloneElement(leftButton, { disabled })}
          </Tooltip>,
          React.cloneElement(
            <Button
              icon={
                <IconWrapper
                  icon={<ChevronDownRegular />}
                  wrapperClass="icon-down"
                />
              }
            />
          ),
        ]}
      >
        {buttonIcon && (
          <IconWrapper
            style={iconStyle}
            icon={React.createElement(buttonIcon)}
          />
        )}
        {buttonLabel}
      </Dropdown.Button>
    ) : (
      <Dropdown.Button
        menu={dropDownMenu}
        onClick={onClick}
        trigger={["click"]}
        className={`${wrapperClass ? wrapperClass : ""} tray-button-with-icon`}
        placement="bottomLeft"
        // disabled={disabled}
        buttonsRender={([leftButton, rightButton]) => [
          <Tooltip
            title={tooltip}
            key="leftButton"
            placement="bottom"
            color="white"
          >
            {React.cloneElement(leftButton, { disabled })}
          </Tooltip>,
          React.cloneElement(
            <Button
              icon={
                <IconWrapper
                  icon={<ChevronDownRegular />}
                  wrapperClass="icon-down"
                />
              }
            />
          ),
        ]}
      >
        {buttonIcon && (
          <IconWrapper
            style={iconStyle}
            icon={React.createElement(buttonIcon)}
          />
        )}
        {buttonLabel}
      </Dropdown.Button>
    );
  } else if (tooltip) {
    return (
      <Tooltip
        title={tooltip}
        key="leftButton"
        placement="bottom"
        color="white"
        overlayInnerStyle={{ whiteSpace: "pre-line" }}
      >
        <Button
          onClick={onClick}
          className={wrapperClass}
          style={buttonStyle}
          disabled={disabled}
        >
          {buttonIcon && (
            <IconWrapper
              style={iconStyle}
              icon={React.createElement(buttonIcon)}
              wrapperClass={buttonLabel ? "mr-2.5" : ""}
            />
          )}
          {buttonLabel}
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Button
        onClick={onClick}
        className={wrapperClass}
        style={buttonStyle}
        disabled={disabled}
      >
        {buttonIcon && (
          <IconWrapper
            style={iconStyle}
            icon={React.createElement(buttonIcon)}
          />
        )}
        {buttonLabel}
      </Button>
    );
  }
};

export default RibbonButton;
