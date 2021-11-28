import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { UserModel } from "../../models/user.model";

export interface UserState {
  details: Omit<UserModel, "username" | "password">;
  accessToken: string;
}

const initialState: UserState = {
  details: { firstName: "", lastName: "", isAdmin: 0, id: -1 },
  accessToken: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUserCredentials: (
      state,
      { payload: { details, accessToken } }: PayloadAction<UserState>
    ) => {
      state.details = details;
      state.accessToken = accessToken;
      localStorage.setItem("token", accessToken);
    },
    removeUserCredentials: (state) => {
      state.details = { firstName: "", lastName: "", isAdmin: 0, id: -1 };
      state.accessToken = "";
      localStorage.removeItem("token");
    },
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectIsAdmin = (state: RootState) => {
  return state.user?.details?.isAdmin === 1;
};
export const selectIsAuth = (state: RootState) => {
  return state.user.accessToken.length > 0;
};
export const selectUserId = (state: RootState) => state.user?.details?.id;
export const selectAccessToken = (state: RootState) => state.user?.accessToken;
export const selectCurrentUser = (state: RootState) => state.user;

export const { setUserCredentials, removeUserCredentials } = userSlice.actions;
export default userSlice.reducer;
