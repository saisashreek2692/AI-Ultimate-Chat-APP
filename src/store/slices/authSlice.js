import { createSlice } from "@reduxjs/toolkit";

const SESSION_KEY = "aipp_session";
const USERS_KEY = "aipp_users";

const seedDemoUser = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    if (!users["demo@aipp.ai"]) {
      users["demo@aipp.ai"] = {
        name: "Demo User",
        email: "demo@aipp.ai",
        pass: "demo123",
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  } catch {
    /* empty */
  }
};

const loadSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

const makeInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

seedDemoUser();

const authSlice = createSlice({
  name: "auth",
  initialState: { user: loadSession() },
  reducers: {
    loginSuccess(state, { payload }) {
      state.user = payload;
      localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem(SESSION_KEY);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

// Thunks
export const loginThunk =
  ({ email, password }) =>
  (dispatch) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    const user = users[email];
    if (!user || user.pass !== password)
      throw new Error("Invalid email or password.");
    const payload = {
      name: user.name,
      email,
      initials: makeInitials(user.name),
    };
    dispatch(loginSuccess(payload));
  };

export const registerThunk =
  ({ name, email, password }) =>
  (dispatch) => {
    if (!name || !email || !password) throw new Error("All fields required.");
    if (password.length < 6) throw new Error("Password must be 6+ characters.");
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    if (users[email]) throw new Error("Email already registered.");
    users[email] = { name, email, pass: password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const payload = { name, email, initials: makeInitials(name) };
    dispatch(loginSuccess(payload));
  };
