import { createSelector } from "@reduxjs/toolkit";

export const selectMultiTaskState = (rootState) => rootState["multiTask"];

export const selectMultiTask = createSelector(
  selectMultiTaskState,
  (s) => s.tasks
);

export const selectIsEmailOpened = createSelector(
  selectMultiTaskState,
  (s) => s.isEmailOpened
);

export const selectCurrentTaskCount = createSelector(
  selectMultiTaskState,
  (s) => s.tasks.length
);

export const selectCurrentTaskId = createSelector(
  selectMultiTaskState,
  (s) => s.currentTask
);
