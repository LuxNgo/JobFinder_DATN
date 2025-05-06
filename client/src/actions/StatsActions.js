import { API_BASE_URL } from '../config/api.config';
import axios from 'axios';

export const FETCH_STATS_REQUEST = 'FETCH_STATS_REQUEST';
export const FETCH_STATS_SUCCESS = 'FETCH_STATS_SUCCESS';
export const FETCH_STATS_FAIL = 'FETCH_STATS_FAIL';

export const fetchStatsRequest = () => ({
    type: FETCH_STATS_REQUEST
});

export const fetchStatsSuccess = (stats) => ({
    type: FETCH_STATS_SUCCESS,
    payload: stats
});

export const fetchStatsFail = (error) => ({
    type: FETCH_STATS_FAIL,
    payload: error
});

export const getStats = () => async (dispatch) => {
    try {
        dispatch(fetchStatsRequest());
        const response = await axios.get(`${API_BASE_URL}/stats`);
        dispatch(fetchStatsSuccess(response.data));
    } catch (error) {
        dispatch(fetchStatsFail(error.response?.data?.message || 'Failed to fetch stats'));
    }
};
