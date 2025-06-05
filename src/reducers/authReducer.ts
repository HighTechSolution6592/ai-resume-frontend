import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
}

type UserState = User | false | null;

const authSlice = createSlice({
  name: "auth",
  initialState: null as UserState,
  reducers: {
    fetchUser(state, action: PayloadAction<User | null | false>) {
      return action.payload || false;
    },
  },
});

export const { fetchUser } = authSlice.actions;
export default authSlice.reducer;
