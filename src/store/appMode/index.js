import { createSlice } from "@reduxjs/toolkit";
import { LAYOUT_MODE, THEME } from "../../constants";

export const appState = {
  layout: LAYOUT_MODE.horizontal,
  theme: THEME.light,
  width: null,
};

export const appModeSlice = createSlice({
  name: "appmode",
  initialState: appState,
  reducers: {
    updateLayout: (state, action) => {
      const mode = action.payload;
      state.layout = mode;
    },
    updateTheme: (state, action) => {
      const appTheme = action.payload;
      state.theme = appTheme;
    },
    updateDeviceWidth: (state, action) => {
      const appWidth = action.payload;
      state.width = appWidth;
    },
  },
});

//export actions
export const { updateLayout, updateTheme, updateDeviceWidth } =
  appModeSlice.actions;

export default appModeSlice.reducer;
