import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const ribbonActionState = {
  isAllEmailSelected: false,
  selectedEmails: []
};

//Ribbon action slice
export const ribbonActionSlice = createSlice({
  name: "ribbonAction",
  initialState: ribbonActionState,
  reducers: {
    updateIsAllEmailSelected: (state) => {
      if(state.isAllEmailSelected) {
        state.selectedEmails = ribbonActionState.selectedEmails;
      }
      state.isAllEmailSelected = !state.isAllEmailSelected
    },
    addSelectedCurrentEmail: (state, action) => {
      const mail_id = action.payload;
      if(mail_id.length < 10) return;
      state.selectedEmails = [...state.selectedEmails, mail_id]
    },
    removeSelectedCurrentEmail: (state, action) => {
      const mail_id = action.payload;
      if(mail_id.length < 10) return;
      state.selectedEmails = [...state.selectedEmails]?.filter(mId => mId !== mail_id)
    },
    resetRibbonActions: (state) => {
      state.isAllEmailSelected = false;
      state.selectedEmails = [];
    }
  },
  extraReducers: (builder) => {},
});

//export actions
export const { updateIsAllEmailSelected, addSelectedCurrentEmail, removeSelectedCurrentEmail, resetRibbonActions } = ribbonActionSlice.actions;

export default ribbonActionSlice.reducer;
