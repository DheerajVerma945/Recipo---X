import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserDoc } from '../appwriteService/user';
import { user } from '../appwriteService/auth';


const initialState = {
    userData: null,
    userDoc: null,
    error: null,
};

export const userThunk = createAsyncThunk('auth/user', async ({ id }, { rejectWithValue }) => {
    try {
        const { userData } = await user(id);
        return { userData };
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch user.');
    }
});
export const userDocThunk = createAsyncThunk('user/getUserDoc', async ({ id }, { rejectWithValue }) => {
    try {
        const { userDoc } = await getUserDoc(id);
        return { userDoc };
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch user doc.');
    }
});
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userThunk.fulfilled, (state, action) => {
                state.userData = action.payload.userData;
                state.error = null;
            })
            .addCase(userThunk.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(userDocThunk.fulfilled, (state, action) => {
                state.userDoc = action.payload.userDoc;
                state.error = null;
            })
            .addCase(userDocThunk.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
})

export default userSlice.reducer;