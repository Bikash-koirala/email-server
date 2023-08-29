import { createSelector } from "@reduxjs/toolkit";

export const selectEmailState = (rootState) => rootState["email"];

export const selectAllEmailState = createSelector(selectEmailState, (s) => s);

export const selectAllFolderEmails = createSelector(
  selectEmailState,
  (s) => s.results
);

export const selectAllFolderEmailIds = createSelector(
  selectAllFolderEmails,
  (s) => s.map((mid) => mid.mail_id)
);

export const selectAllFolderEmailsLoading = createSelector(
  selectEmailState,
  (s) => s.loading
);

export const selectAllFolderEmailsCount = createSelector(
  selectEmailState,
  (s) => s.count
);

export const selectAllFolderEmailsError = createSelector(
  selectEmailState,
  (s) => s.error
);

export const selectEmailSync = createSelector(selectEmailState, (s) => s.sync);

export const selectEmailFolders = createSelector(
  selectEmailState,
  (s) => s.folders
);

export const selectCurrentFolderId = createSelector(
  selectEmailState,
  (s) => s.folder_id
);

export const selectCurrentEmailDetails = createSelector(
  selectEmailState,
  (s) => s.currentEmailDetails || {}
);

export const selectEmailPayloadForMultiTab = createSelector(
  selectCurrentEmailDetails,
  (s) => {
    return {
      subject: s.subject,
      mailId: s.id,
    };
  }
);
