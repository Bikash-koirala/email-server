import { createSelector } from "@reduxjs/toolkit";

export const selectProfileState = (rootState) => rootState["profile"];

export const selectProfile = createSelector(
  selectProfileState,
  (s) => s.profile
);

export const selectProfileLoading = createSelector(
  selectProfileState,
  (s) => s.loading
);
