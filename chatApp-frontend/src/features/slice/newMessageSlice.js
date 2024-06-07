import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unviewedCounts: {},
  newMessages: [],
};

const newMessageSlice = createSlice({
  name: 'newMessages',
  initialState,
  reducers: {
    updateUnviewedCounts(state, action) {
      action.payload.forEach(({ userId, count }) => {
        if (state.unviewedCounts[userId]) {
          state.unviewedCounts[userId] += count;
        } else {
          state.unviewedCounts[userId] = count;
        }
      });
    },
    addNewMessage(state, action) {
      state.newMessages.push(action.payload);
    },
    clearNewMessages(state) {
      state.newMessages = [];
    },
    updateAsViewed(state, action) {
      const { userId, count } = action.payload;
      state.unviewedCounts[userId] = count; // Set the count directly to the specified user
    },
  },
});

export const { updateUnviewedCounts, addNewMessage, clearNewMessages, updateAsViewed } = newMessageSlice.actions;
export default newMessageSlice.reducer;
