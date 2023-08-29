import { createSelector } from "@reduxjs/toolkit";

export const selectRibbonActionState = (rootState) => rootState["ribbonAction"];


export const selectAllEmailSelected = createSelector(
  selectRibbonActionState,
  (s) => s.isAllEmailSelected
);

export const selectSelectedEmailLists = createSelector(selectRibbonActionState, s => s.selectedEmails);