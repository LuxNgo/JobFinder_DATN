import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/api.config';
import axios from 'axios';

export const fetchStats = createAsyncThunk(
    'stats/fetchStats',
    async () => {
        const response = await axios.get(`${API_BASE_URL}/stats`);
        return response.data;
    }
);

const initialState = {
    stats: {
        activeJobs: 0,
        companies: 0,
        applicants: 0,
        hires: 0
    },
    loading: false,
    error: null
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default statsSlice.reducer;
