import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const profileState = {
  loading: false,
  error: "",
  profile: null,
};

//users slice
export const profileSlice = createSlice({
  name: "profile",
  initialState: profileState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = action.payload
    },
    removeProfile: (state) => {
      state = profileState
    }
  },
});

//export actions
export const { updateProfile, removeProfile } = profileSlice.actions;

export default profileSlice.reducer;
