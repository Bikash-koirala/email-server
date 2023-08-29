import { createSelector } from "@reduxjs/toolkit";

export const selectAppMode = (rootState) => rootState["appMode"];

export const selectLayout = createSelector(selectAppMode, (s) => s.layout);

export const selectTheme = createSelector(selectAppMode, (s) => s.theme);

export const selectDeviceWidth = createSelector(selectAppMode, (s) => s.width);
