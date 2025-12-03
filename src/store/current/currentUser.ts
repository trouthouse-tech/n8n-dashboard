import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, createEmptyUser } from '@/model';

const initialState: User = createEmptyUser();

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => action.payload,
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setCompanyName: (state, action: PayloadAction<string>) => {
      state.companyName = action.payload;
    },
    setIndustry: (state, action: PayloadAction<string>) => {
      state.industry = action.payload as User['industry'];
      // Clear industryOther if not selecting "Other"
      if (action.payload !== 'Other') {
        state.industryOther = '';
      }
    },
    setIndustryOther: (state, action: PayloadAction<string>) => {
      state.industryOther = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentUserActions = currentUserSlice.actions;
export default currentUserSlice.reducer;

