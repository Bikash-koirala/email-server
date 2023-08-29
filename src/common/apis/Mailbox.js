import config from "../../config";
import reactQueryFetcher from "../../utils/fetcher";
import Auth from "./Auth";
import { HTTP_METHODS } from "../../constants/http";

class MailBox {
  constructor() {
    this.base_url = config.apiBaseUrl;
  }

  connectMailBox = async (url) => {
    return await reactQueryFetcher({
      url: url,
      method: "GET",
    });
  };

  saveMailboxToken = async (code) => {
    try {
      const { data, error } = await reactQueryFetcher({
        url: `${this.base_url}/integration/save-token/microsoft/`,
        method: "GET",
        params: { code },
      });
      if (!error) {
        await new Promise((res) => {
          Auth.storeMailbox({
            microsoft: true,
          });
          res();
        });
        // window.location.href = "/"
        return data;
      }
      throw new Error("Something went wrong!. please try again ");
    } catch (error) {
      Auth.removeMailboxes();
      throw new Error("Something went wrong!. please try again ");
    }
  };

  fetchMailboxes = async () => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/sync/mail-folders/`,
        method: HTTP_METHODS.POST,
      });
    } catch (error) {}
  };

  fetchMailboxesFolders = async () => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/get/mail-folders/`,
        method: HTTP_METHODS.GET,
      });
    } catch (error) {}
  };

  syncMailBoxes = async () => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/sync/mail/`,
        method: HTTP_METHODS.POST,
      });
    } catch (error) {}
  };

  /**
   * Retrives the all Emails under folder
   * @required folder_id : number
   * @optional page: number
   * @returns List of Emails
   */
  fetchEmailByFolder = async (folder_id = 0, page = 1) => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/get/mails/`,
        method: HTTP_METHODS.GET,
        params: { mail_folder: folder_id, page },
      });
    } catch (error) {
      throw new Error("Failed to get emails! Please try again");
    }
  };
  fetchEmailById = async () => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/get/mail/${emailId}`,
        method: HTTP_METHODS.GET,
        params: { mail_id: id },
      });
    } catch (error) {
      throw new Error("Failed to get an email! Please try again");
    }
  };

  deleteEmail = async (id) => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/delete/mail/${id}/`,
        method: HTTP_METHODS.DELETE,
        headers: { crossDomain: true, "Content-Type": "application/json" },
        data: {},
      });
    } catch (error) {
      throw new Error("Failed to delete an email! Please try again");
    }
  };

  //move emaail
  moveEmails = async (data) => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/move/message/`,
        method: HTTP_METHODS.POST,
        data,
      });
    } catch (error) {
      throw new Error("Failed to move an email! Please try again");
    }
  };
  //Read/Unread Email messages
  toggleEmailRead = async (data) => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/patch/messages/`,
        method: HTTP_METHODS.POST,
        data,
      });
    } catch (error) {
      throw new Error("Failed to Read/unread emails! Please try again");
    }
  };

  //Delete multiple Emails
  deleteMultipleEmails = async (data) => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/delete/selected-mail/`,
        method: HTTP_METHODS.DELETE,
        data,
      });
    } catch (error) {
      throw new Error("Could not delete the emails! Please try again");
    }
  };

  // create mail folder
  createMailFolder = async (data) => {
    try {
      return await reactQueryFetcher({
        url: `${this.base_url}/integration/create/mail-folder/`,
        method: HTTP_METHODS.POST,
        data,
      });
    } catch (error) {
      throw new Error("Could not create the folder! Please try again");
    }
  };
}

export default new MailBox();
