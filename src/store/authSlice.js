import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signup, login, checkSession } from '../appwriteService/auth';

const initialState = {
    status: 'idle',
    session: null,
    error: null,
};

export const signupThunk = createAsyncThunk('auth/signup', async ({ email, password, name }, { rejectWithValue }) => {
    try {
        const response = await signup(email, password, name);
        return response;
    } catch (error) {
        return rejectWithValue(error.message || 'Signup failed. Please try again.');
    }
});

export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const { session } = await login(email, password);
        return { session };
    } catch (error) {
        return rejectWithValue(error.message || 'Login failed.');
    }
});

export const checkSessionThunk = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
    try {
        const session = await checkSession();
        return { session };
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to check session.');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.session = action.payload.session;
                state.error = null;
            })
            .addCase(signupThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })

            .addCase(loginThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.session = action.payload.session;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })

            .addCase(checkSessionThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(checkSessionThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.session = action.payload.session;
                state.error = null;
            })
            .addCase(checkSessionThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.session = null;
                state.error = action.payload || action.error.message;
            });
    }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
