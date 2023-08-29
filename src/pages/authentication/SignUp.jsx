import React, { useState, useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import LoginBg from "../../assets/images/registerBg.jpg";
import ButtonLoader from "../../common/components/ButtonLoader/ButtonLoader";
import MicrosoftIcon from "../../assets/images/MiccosoftIcon.png";

export default function SignUp() {
  const navigate = useNavigate();
  //   essentials states for the form
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [loading, setLoading] = useState(false);

  //  necessary inputs
  const formInputs = [
    {
      name: "username",
      inputRules: [{ required: true, message: "Please input your username!" }],
      placeholder: "Username",
    },
    {
      name: "password",
      inputRules: [{ required: true, message: "Please input your password!" }],
      placeholder: "Password",
      type: "password",
    },
  ];

  // To disable submit button at the beginning.
  useEffect(() => {
    console.log("disabling...");
    forceUpdate({});
  }, []);

  // form after submiting
  const onFinish = (values) => {
    setLoading(true);
    for (let credential in values) {
      if (values[credential] === "BrainTip" && "BrainTip@123") {
        // display the toaster successfully logged in

        // stop the button loader
        setLoading(false);

        // pushing into dashboard
        navigate("dashboard", { replace: true });
      }
    }
    // setTimeout(() => {
    //   setLoading(false);
    //   console.log("Handle the request:", values);
    // }, 6000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#EAF0FA] flex items-center justify-center">
      <div className="max-w-4xl w-full px-2">
        <div className="flex bg-white border border-gray-100 shadow-lg rounded-2xl justify-center items-center py-10">
          <div className="overflow-hidden  h-full w-1/2 p-3 md:block hidden">
            <img
              src={LoginBg}
              alt="login_bg"
              className="login-bg-bounce h-full w-full"
            />
          </div>
          {/* form container */}
          <div className="flex-1 px-6 w-full">
            <div>
              <div>
                <div className="text-gray-600 xl:text-4xl text-3xl font-bold">
                  Register
                </div>
                <div className="text-gray-400 py-3">
                  Enter your valid credentials below
                </div>
              </div>
              <div className="mt-12">
                <Form
                  form={form}
                  autoComplete="off"
                  name="horizontal_login"
                  layout="block"
                  onFinish={onFinish}
                >
                  {formInputs?.map((input, index) => {
                    const { name, inputRules } = input;
                    return (
                      <Form.Item
                        className=""
                        name={name}
                        rules={inputRules}
                        key={index}
                      >
                        {name === "username" ? (
                          <Input
                            prefix={
                              <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Your Username"
                            size="large"
                          />
                        ) : (
                          <Input.Password
                            placeholder="Your password"
                            prefix={
                              <LockOutlined className="site-form-item-icon" />
                            }
                            size="large"
                          />
                        )}
                      </Form.Item>
                    );
                  })}

                  {/* button */}
                  <div>
                    <Form.Item shouldUpdate>
                      {() => (
                        <ButtonLoader
                          loading={loading}
                          form={form}
                          title="Sign Up"
                        />
                      )}
                    </Form.Item>
                  </div>
                  <div className="flex items-center justify-center text-gray-500">
                    OR
                  </div>
                </Form>
                {/* button */}
                <div className="pt-4 relative">
                  <Button className="w-full" size="large">
                    Continue With Microsoft
                  </Button>
                  <img
                    className="absolute top-5 left-20 h-7 w-7"
                    src={MicrosoftIcon}
                    alt="microsoft_icon"
                  />
                </div>
                <div>
                  <div className="text-gray-400 pt-5">
                    Already have a account?
                  </div>
                  <Link to="/" className="underline text-gray-500">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
