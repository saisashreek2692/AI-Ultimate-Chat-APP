import { createSlice } from '@reduxjs/toolkit';

let toastId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, drawerOpen: false, toasts: [] },
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar(state) { state.sidebarOpen = false; },
    toggleDrawer(state) { state.drawerOpen = !state.drawerOpen; },
    closeDrawer(state) { state.drawerOpen = false; },
    addToast(state, { payload: { message, icon = '✓' } }) {
      state.toasts.push({ id: ++toastId, message, icon });
    },
    removeToast(state, { payload: id }) {
      state.toasts = state.toasts.filter((t) => t.id !== id);
    },
  },
});

export const { toggleSidebar, closeSidebar, toggleDrawer, closeDrawer, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;

export const showToast = (message, icon = '✓') => (dispatch) => {
  const id = ++toastId;
  dispatch(addToast({ message, icon }));
  setTimeout(() => dispatch(removeToast(id)), 3000);
};
