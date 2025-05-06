const initialState = {
    loading: false,
    stats: {
        activeJobs: 0,
        companies: 0,
        applicants: 0,
        hires: 0
    },
    error: null
};

export const statsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_STATS_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_STATS_SUCCESS':
            return {
                ...state,
                loading: false,
                stats: action.payload
            };
        case 'FETCH_STATS_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
