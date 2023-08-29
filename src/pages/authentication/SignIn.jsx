import React, { useState, useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import LoginBg from "../../assets/images/loginBg1.jpg";
import ButtonLoader from "../../common/components/ButtonLoader/ButtonLoader";
import Auth from "../../common/apis/Auth";
import { useAuth } from "../../common/hooks/auth";
import Loader from "../../common/components/Loader";

export default function SignIn() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  //   essentials states for the form
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [, forceUpdate] = useState({});
  const [loading, setLoading] = useState(false);
  const [appLoader, setAppLoader] = useState(true);

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
    // if (isAuth) {
    //   navigate("/email");
    // }
    forceUpdate({});
  }, []);

  useEffect(() => {
    if (isAuth) {
      navigate("/email");
    } else {
      setAppLoader(false);
    }
  }, [isAuth]);

  // form after submiting
  const onFinish = async (values) => {
    setLoading(true);
    try {
      setError("");
      await Auth.login(values);
    } catch (error) {
      notification.error({
        message: error.message,
        placement: "top",
      });
      // setError(error.message);
      setLoading(false);
    }
  };

  if (appLoader) return <Loader />;

  return (
    <>
      <div className="h-screen w-screen overflow-hidden bg-[#EAF0FA] dark:bg-Dark2 flex items-center justify-center">
        <div className="max-w-4xl w-full px-2">
          <div className="flex bg-white dark:bg-Dark2 border border-gray-100 shadow-lg rounded-2xl justify-center items-center py-10">
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
                    Log In
                  </div>
                  <div className="text-gray-400 py-3">
                    Enter your valid credentials below
                  </div>
                </div>
                <div className="mt-12">
                  {error && <div className="text-red-600">{error}</div>}
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
                            <div>
                              <Input
                                prefix={
                                  <UserOutlined className="site-form-item-icon" />
                                }
                                placeholder="Your Username"
                                size="large"
                              />
                            </div>
                          ) : (
                            <div className="pt-4">
                              <Input.Password
                                placeholder="Your password"
                                prefix={
                                  <LockOutlined className="site-form-item-icon" />
                                }
                                size="large"
                              />
                            </div>
                          )}
                        </Form.Item>
                      );
                    })}

                    {/* button */}
                    <div className="pt-6">
                      <Form.Item shouldUpdate>
                        {() => (
                          <ButtonLoader
                            loading={loading}
                            form={form}
                            title="Sign In"
                          />
                        )}
                      </Form.Item>
                    </div>
                    {/* <div className="flex items-center justify-center text-gray-500">
                      OR
                    </div> */}
                  </Form>
                  {/* button */}
                  {/* <div className="pt-4 relative">
                    <Button className="w-full" size="large">
                      Continue With Microsoft
                    </Button>
                    <img
                      className="absolute top-5 left-20 h-7 w-7"
                      src={MicrosoftIcon}
                      alt="microsoft_icon"
                    />
                  </div> */}
                  {/* <div>
                    <div className="text-gray-400 pt-5">
                      Don't have a account?
                    </div>
                    <Link to="/sign-up" className="underline text-gray-500">
                      Sign up
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
