import { createSlice } from '@reduxjs/toolkit';

interface LayoutBuilderState {
  isSidebarCollapsed: boolean;
}

const initialState: LayoutBuilderState = {
  isSidebarCollapsed: false,
};

const layoutBuilderSlice = createSlice({
  name: 'layoutBuilder',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    collapseSidebar: (state) => {
      state.isSidebarCollapsed = true;
    },
    expandSidebar: (state) => {
      state.isSidebarCollapsed = false;
    },
    reset: () => initialState,
  },
});

export const LayoutBuilderActions = layoutBuilderSlice.actions;
export default layoutBuilderSlice.reducer;

