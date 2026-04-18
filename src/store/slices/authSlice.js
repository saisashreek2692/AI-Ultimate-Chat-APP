/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { hydrateBilling, resetBilling } from "./billingSlice";

const SESSION_KEY = "aipp_session";
const USERS_KEY = "aipp_users";

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
};
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const loadSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
};
const makeInit = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* Seed demo user */
(function () {
  try {
    const u = getUsers();
    if (!u["demo@aipp.ai"]) {
      u["demo@aipp.ai"] = {
        name: "Demo User",
        email: "demo@aipp.ai",
        pass: "demo123",
        bio: "",
        avatar: "",
      };
      saveUsers(u);
    }
  } catch {
    /* empty */
  }
})();

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    const users = getUsers();
    const user = users[email];
    if (!user || user.pass !== password)
      return rejectWithValue("Invalid email or password.");
    const payload = {
      name: user.name,
      email,
      initials: makeInit(user.name),
      bio: user.bio || "",
      avatar: user.avatar || "",
    };
    dispatch(hydrateBilling(email));
    return payload;
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    if (!name || !email || !password)
      return rejectWithValue("All fields are required.");
    if (password.length < 6)
      return rejectWithValue("Password must be at least 6 characters.");
    const users = getUsers();
    if (users[email])
      return rejectWithValue("An account with this email already exists.");
    users[email] = { name, email, pass: password, bio: "", avatar: "" };
    saveUsers(users);
    const payload = {
      name,
      email,
      initials: makeInit(name),
      bio: "",
      avatar: "",
    };
    dispatch(hydrateBilling(email));
    return payload;
  },
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async ({ name, bio }, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    if (!name.trim()) return rejectWithValue("Name cannot be empty.");
    const users = getUsers();
    if (!users[user.email]) return rejectWithValue("User not found.");
    users[user.email] = {
      ...users[user.email],
      name: name.trim(),
      bio: bio.trim(),
    };
    saveUsers(users);
    return {
      ...user,
      name: name.trim(),
      bio: bio.trim(),
      initials: makeInit(name.trim()),
    };
  },
);

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { getState, rejectWithValue }) => {
    const { user } = getState().auth;
    const users = getUsers();
    const stored = users[user.email];
    if (!stored || stored.pass !== currentPassword)
      return rejectWithValue("Current password is incorrect.");
    if (newPassword.length < 6)
      return rejectWithValue("New password must be at least 6 characters.");
    if (currentPassword === newPassword)
      return rejectWithValue("New password must differ from current.");
    users[user.email] = { ...stored, pass: newPassword };
    saveUsers(users);
    return true;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: loadSession(), loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem(SESSION_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
    restoreSession(state, { payload }) {
      state.user = payload;
    },
  },
  extraReducers: (builder) => {
    const persist = (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.user = payload;
      localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    };
    const fail = (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    };
    builder
      .addCase(loginThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, persist)
      .addCase(loginThunk.rejected, fail)
      .addCase(registerThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerThunk.fulfilled, persist)
      .addCase(registerThunk.rejected, fail)
      .addCase(updateProfileThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, persist)
      .addCase(updateProfileThunk.rejected, fail)
      .addCase(changePasswordThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (s) => {
        s.loading = false;
        s.error = null;
      })
      .addCase(changePasswordThunk.rejected, fail);
  },
});

export const { logout, clearAuthError, restoreSession } = authSlice.actions;
export default authSlice.reducer;
