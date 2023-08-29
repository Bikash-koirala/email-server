import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import qs from "qs";
import Mailbox from "../../common/apis/Mailbox";
import { EMAIL_SYNCED_STATUS } from "../../constants";
import { resetRibbonActions, updateIsAllEmailSelected } from "../ribbon";

export const emailState = {
  loading: false,
  error: "",
  count: null,
  next: null,
  results: [],
  folder_id: null,
  sync: EMAIL_SYNCED_STATUS.initial,
  folders: [],
  currentEmailDetails: null,
};

//Get mails
export const getEmailsByFolder = createAsyncThunk(
  "email/fetchEmail",
  async (current_folder_id, ThunkAPI) => {
    const {
      email: { folder_id },
    } = ThunkAPI.getState();
    const { data } = await Mailbox.fetchEmailByFolder(
      current_folder_id || folder_id
    );
    //redux thunk data pass
    return { ...data, next: qs.parse(data?.next)?.page || null };
  }
);

// load more emails
export const getLoadMoreEmails = createAsyncThunk(
  "email/load-more",
  async (payload, ThunkAPI) => {
    const { data } = await Mailbox.fetchEmailByFolder(
      payload.folder_id,
      parseInt(payload.page)
    );
    if (data) {
      const updatedData = {
        ...data,
        next: qs.parse(data?.next)?.page || null,
      };
      // ThunkAPI.dispatch(loadMoreEmail(updatedData));
      return updatedData;
    }
    return false;
  }
);
//Get mails by id
export const getEmailsById = createAsyncThunk(
  "email/fetchEmail",
  async (current_mail_id, ThunkAPI) => {
    const {
      email: { mail_id },
    } = ThunkAPI.getState();
    const { data } = await Mailbox.fetchEmailById(current_mail_id || mail_id);
    //redux thunk data pass
    return data;
  }
);

//sync mails
export const syncAllEmails = createAsyncThunk(
  "email/syncEmail",
  async (_, ThunkAPI) => {
    try {
      ThunkAPI.dispatch(updateEmailSync(EMAIL_SYNCED_STATUS.request));
      const { data } = await Mailbox.syncMailBoxes();
      ThunkAPI.dispatch(updateEmailSync(EMAIL_SYNCED_STATUS.success));
      return data;
    } catch (error) {
      ThunkAPI.dispatch(updateEmailSync(EMAIL_SYNCED_STATUS.error));
      return error.message;
    }
  }
);

//moveEmail
export const moveEmail = createAsyncThunk(
  "email/move",
  async ({ data, isTrash = false }, { dispatch, getState }) => {
    try {
      let payload = {};
      const {
        email: { results },
        ribbonAction: { isAllEmailSelected, selectedEmails },
      } = getState();
      if (isAllEmailSelected) {
        payload = {
          ...data,
          message_id: results?.map((em) => em.mail_id),
        };
      } else {
        payload = {
          ...data,
          message_id: selectedEmails,
        };
      }
      const { error } = isTrash
        ? await Mailbox.deleteMultipleEmails({ ids: payload.message_id })
        : await Mailbox.moveEmails(payload);
      if (error) {
        throw new Error("unable to proceed further.");
      }
      dispatch(deleteEmailInStore(payload.message_id));
      if (isAllEmailSelected) {
        dispatch(getEmailsByFolder());
        dispatch(updateIsAllEmailSelected());
      }
      dispatch(resetRibbonActions());
      return true;
    } catch (error) {
      throw error;
    }
  }
);
//Read/Unread
export const toggleEmailRead = createAsyncThunk(
  "email/read-unread",
  async (_, { dispatch, getState }) => {
    const {
      email: { results },
      ribbonAction: { isAllEmailSelected, selectedEmails },
    } = getState();
    try {
      if (isAllEmailSelected) {
        const messages = [...results]?.map((email) => {
          return {
            message_id: email.mail_id,
            is_read: !email.is_read,
          };
        });
        await Mailbox.toggleEmailRead({ messages });
        dispatch(updateReadUnread(messages));
      } else {
        const messages = selectedEmails?.reduce((acc, curr) => {
          [...results]?.forEach((rs) => {
            if (rs.mail_id === curr) {
              acc.push({
                message_id: curr,
                is_read: !rs.is_read,
              });
            }
          });
          return acc;
        }, []);
        await Mailbox.toggleEmailRead({ messages });
        dispatch(updateReadUnread(messages));
      }
      dispatch(resetRibbonActions());
      return true;
    } catch (error) {
      throw new Error({ error });
    }
  }
);

//update emails silently => if socket gets new mail request then need to update the store silently.
export const updateEmailSilently = createAsyncThunk(
  "email/update-silent",
  async (_, { dispatch, getState }) => {
    //we need one api that only gives the result of latest emails
  }
);

// create mail folder
export const createNewMailFolder = createAsyncThunk(
  "email/new-folder",
  async (payload, ThunkAPI) => {
    try {
      const { data, error, errorObj } = await Mailbox.createMailFolder(payload);
      // ThunkAPI.dispatch(updateEmailSync(EMAIL_SYNCED_STATUS.success));
      if (error) {
        ThunkAPI.rejectWithValue(errorObj);
        return;
      }
      return data;
    } catch (error) {
      ThunkAPI.rejectWithValue(error.message);
    }
  }
);

//users slice
export const emailSlice = createSlice({
  name: "Email",
  initialState: emailState,
  reducers: {
    updateCurrentEmailFolder: (state, action) => {
      state.folder_id = action.payload;
    },
    updateEmailSync: (state, action) => {
      const status = action.payload;
      const syncLabels = Object.values(EMAIL_SYNCED_STATUS);

      if (syncLabels?.find((lb) => lb === status)) {
        state.sync = status;
      }
    },
    loadMoreEmail: (state, action) => {
      const { next, results } = action.payload;
      state.next = parseInt(next);
      state.results = [...state.results, ...results];
    },
    deleteEmailInStore: (state, action) => {
      const mail_id_Arr = action.payload;
      state.results = [...state.results]?.filter(
        (mb) => !mail_id_Arr.some((md) => md === mb.mail_id)
      );
    },
    updateFolders: (state, action) => {
      state.folders = action.payload;
    },
    updateReadUnread: (state, action) => {
      const toggleEmails = action.payload || [];

      const updatedEmails = [...state.results]?.reduce((acc, curr) => {
        let tempCur = curr;
        toggleEmails.forEach((tg) => {
          if (curr.mail_id === tg.message_id) {
            tempCur = {
              ...curr,
              is_read: tg.is_read,
            };
          }
        });
        acc.push(tempCur);
        return acc;
      }, []);
      state.results = updatedEmails;
    },
    updateCurrentEmailDetails: (state, action) => {
      state.currentEmailDetails = action.payload;
    },
    removeCurrentEmailDetails: (state) => {
      state.currentEmailDetails = emailState.currentEmailDetails;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmailsByFolder.pending, (state) => {
        state.error = "";
        state.count = 0;
        state.loading = true;
        state.next = null;
        state.results = [];
      })
      .addCase(getEmailsByFolder.fulfilled, (state, action) => {
        state.count = action.payload.count;
        state.loading = false;
        state.next = action.payload.next;
        state.results = action.payload.results;
      })
      .addCase(getEmailsByFolder.rejected, (state, action) => {
        //we can preserve previous emails
        // state.error = action.payload;
        //state = emailState;
      })
      .addCase(getLoadMoreEmails.pending, (state) => {})
      .addCase(getLoadMoreEmails.fulfilled, (state, action) => {
        const { next, results } = action.payload;
        state.next = parseInt(next);
        state.results = [...state.results, ...results];
      })
      .addCase(getLoadMoreEmails.rejected, (state, action) => {})
      // createNewMailFolder
      .addCase(createNewMailFolder.pending, (state) => {})
      .addCase(createNewMailFolder.fulfilled, (state, action) => {
        const data = action.payload;
        state.folders = [...state.folders, data];
      })
      .addCase(createNewMailFolder.rejected, (state, action) => {});
  },
});

//export actions
export const {
  updateCurrentEmailFolder,
  deleteEmailInStore,
  updateEmailSync,
  loadMoreEmail,
  updateFolders,
  updateReadUnread,
  updateCurrentEmailDetails,
  removeCurrentEmailDetails
} = emailSlice.actions;

export default emailSlice.reducer;
