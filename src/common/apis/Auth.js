import config from "../../config";
import { USER_TOKEN } from "../../constants";
import { HTTP_METHODS } from "../../constants/http";
import reactQueryFetcher from "../../utils/fetcher";
import { setAuthToken } from "../../utils/http-utils";
import mailbox from "../hooks/mailbox";

class Auth {
  constructor() {
    this.baseUrl = `${config.apiBaseUrl}/auth/token/`;
    // this.baseUrl = `http://localhost:8000/api/v1/auth/token/`;
  }

  getLocalRefreshToken = () => {
    const user = this.getFromLocalStorage(USER_TOKEN);
    return user?.refresh;
  };

  getLocalAccessToken = () => {
    const user = this.getFromLocalStorage(USER_TOKEN);
    return user?.access;
  };

  updateNewAccessToken = (token) => {
    const user = this.getFromLocalStorage(USER_TOKEN);
    user.access = token;
    this.persistToLocalStorage(USER_TOKEN, user);
  };

  getUser = () => {
    return this.getFromLocalStorage(USER_TOKEN);
  };

  setUser = (user) => {
    this.persistToLocalStorage(USER_TOKEN, user);
    setAuthToken(user.access);
  };

  removeUser = () => {
    localStorage.removeItem(USER_TOKEN);
    setAuthToken("");
  };

  reLogin = async () => {
    try {
      const refresh = this.getLocalRefreshToken();
      if (refresh) {
        const { data, error } = await reactQueryFetcher({
          url: `${this.baseUrl}/refresh`,
          method: HTTP_METHODS.POST,
          data: {},
        });
        if (error) {
          throw new Error("You are not authorized. Please login again.");
        }
        this.updateNewAccessToken(data);
      }
    } catch (error) {
      localStorage.removeItem("mail_boxes_list");
      this.logOut();
    }
  };

  login = async (user) => {
    try {
      const { data, errorObj } = await reactQueryFetcher({
        url: `${this.baseUrl}`,
        method: HTTP_METHODS.POST,
        data: user,
      });

      if (!!data) {
        this.setUser(data);
        window.location.href = "/email";
        return data;
      } else {
        throw new Error(errorObj || "Something went wrong!");
      }
    } catch (error) {
      this.removeUser();
      throw new Error(error.message || "Something went wrong!");
    }
  };

  logOut = () => {
    this.removeUser();
    window.location.href = "/";
  };

  getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };
  persistToLocalStorage = (key, data) => {
    return localStorage.setItem(key, JSON.stringify(data));
  };

  //for mailboxes
  getMailboxes = () => this.getFromLocalStorage("mail_boxes_list") || [];
  //store to mailboxes
  storeMailbox = (mailbox) => {
    //check key and object
    const mailboxesList = this.getMailboxes();
    const updatedMailboxes = [mailbox, ...mailboxesList];
    this.persistToLocalStorage("mail_boxes_list", updatedMailboxes);
  };
  //update mailbox list
  disconnectMailbox = (mailbox) => {
    const mailboxesList = this.getMailboxes();
    const updatedMailboxes = mailboxesList.filter((mb) => mb !== mailbox);
    this.persistToLocalStorage("mail_boxes_list", updatedMailboxes);
  };

  removeMailboxes = () => {
    localStorage.removeItem("mail_boxes_list");
  };
}

export default new Auth();
