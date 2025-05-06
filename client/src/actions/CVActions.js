import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/api.config';

// CV Actions
export const CV_GENERATE_REQUEST = 'CV_GENERATE_REQUEST';
export const CV_GENERATE_SUCCESS = 'CV_GENERATE_SUCCESS';
export const CV_GENERATE_FAIL = 'CV_GENERATE_FAIL';
export const CV_SAVE_REQUEST = 'CV_SAVE_REQUEST';
export const CV_SAVE_SUCCESS = 'CV_SAVE_SUCCESS';
export const CV_SAVE_FAIL = 'CV_SAVE_FAIL';
export const CV_SUGGEST_OBJECTIVE_REQUEST = 'CV_SUGGEST_OBJECTIVE_REQUEST';
export const CV_SUGGEST_OBJECTIVE_SUCCESS = 'CV_SUGGEST_OBJECTIVE_SUCCESS';
export const CV_SUGGEST_OBJECTIVE_FAIL = 'CV_SUGGEST_OBJECTIVE_FAIL';
export const CV_GENERATE_EXPERIENCE_REQUEST = 'CV_GENERATE_EXPERIENCE_REQUEST';
export const CV_GENERATE_EXPERIENCE_SUCCESS = 'CV_GENERATE_EXPERIENCE_SUCCESS';
export const CV_GENERATE_EXPERIENCE_FAIL = 'CV_GENERATE_EXPERIENCE_FAIL';
export const CV_SUGGEST_SKILLS_REQUEST = 'CV_SUGGEST_SKILLS_REQUEST';
export const CV_SUGGEST_SKILLS_SUCCESS = 'CV_SUGGEST_SKILLS_SUCCESS';
export const CV_SUGGEST_SKILLS_FAIL = 'CV_SUGGEST_SKILLS_FAIL';
export const CV_TEMPLATE_RECOMMEND_REQUEST = 'CV_TEMPLATE_RECOMMEND_REQUEST';
export const CV_TEMPLATE_RECOMMEND_SUCCESS = 'CV_TEMPLATE_RECOMMEND_SUCCESS';
export const CV_TEMPLATE_RECOMMEND_FAIL = 'CV_TEMPLATE_RECOMMEND_FAIL';

// Action Creators
export const cvGenerateRequest = () => ({
    type: CV_GENERATE_REQUEST
});

export const cvGenerateSuccess = (cv) => ({
    type: CV_GENERATE_SUCCESS,
    payload: cv
});

export const cvGenerateFail = (error) => ({
    type: CV_GENERATE_FAIL,
    payload: error
});

export const cvSaveRequest = () => ({
    type: CV_SAVE_REQUEST
});

export const cvSaveSuccess = () => ({
    type: CV_SAVE_SUCCESS
});

export const cvSaveFail = (error) => ({
    type: CV_SAVE_FAIL,
    payload: error
});

export const cvSuggestObjectiveRequest = () => ({
    type: CV_SUGGEST_OBJECTIVE_REQUEST
});

export const cvSuggestObjectiveSuccess = (objective) => ({
    type: CV_SUGGEST_OBJECTIVE_SUCCESS,
    payload: objective
});

export const cvSuggestObjectiveFail = (error) => ({
    type: CV_SUGGEST_OBJECTIVE_FAIL,
    payload: error
});

export const cvGenerateExperienceRequest = () => ({
    type: CV_GENERATE_EXPERIENCE_REQUEST
});

export const cvGenerateExperienceSuccess = (experience) => ({
    type: CV_GENERATE_EXPERIENCE_SUCCESS,
    payload: experience
});

export const cvGenerateExperienceFail = (error) => ({
    type: CV_GENERATE_EXPERIENCE_FAIL,
    payload: error
});

export const cvSuggestSkillsRequest = () => ({
    type: CV_SUGGEST_SKILLS_REQUEST
});

export const cvSuggestSkillsSuccess = (skills) => ({
    type: CV_SUGGEST_SKILLS_SUCCESS,
    payload: skills
});

export const cvSuggestSkillsFail = (error) => ({
    type: CV_SUGGEST_SKILLS_FAIL,
    payload: error
});

export const cvTemplateRecommendRequest = () => ({
    type: CV_TEMPLATE_RECOMMEND_REQUEST
});

export const cvTemplateRecommendSuccess = (template) => ({
    type: CV_TEMPLATE_RECOMMEND_SUCCESS,
    payload: template
});

export const cvTemplateRecommendFail = (error) => ({
    type: CV_TEMPLATE_RECOMMEND_FAIL,
    payload: error
});

// API Actions
export const generateCV = (cvData, template) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Please log in first');
        }

        dispatch(cvGenerateRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${API_BASE_URL}/cv/generate`,
            { ...cvData, template },
            config
        );

        // Extract the CV content from the response
        const cvContent = data?.success && data?.cvContent ? data.cvContent : null;
        
        if (cvContent) {
          dispatch(cvGenerateSuccess(cvContent));
          toast.success('CV generated successfully!');
          return cvContent;
        } else {
          throw new Error('Invalid CV content received from server');
        }
    } catch (error) {
        dispatch(cvGenerateFail(error.response?.data?.message || 'Failed to generate CV'));
        toast.error(error.response?.data?.message || 'Failed to generate CV');
        throw error;
    }
};

export const suggestCareerObjective = (jobTitle, industry) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Please log in first');
        }

        dispatch(cvSuggestObjectiveRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${API_BASE_URL}/cv/suggest-objective`,
            { jobTitle, industry },
            config
        );

        dispatch(cvSuggestObjectiveSuccess(data.objective));
        return data.objective;
    } catch (error) {
        dispatch(cvSuggestObjectiveFail(error.response?.data?.message || 'Failed to suggest objective'));
        throw error;
    }
};

export const generateWorkExperience = (experience) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Please log in first');
        }

        dispatch(cvGenerateExperienceRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${API_BASE_URL}/cv/generate-experience`,
            {
                title: experience.title,
                organization: experience.organization,
                description: experience.description,
                type: experience.type
            },
            config
        );

        dispatch(cvGenerateExperienceSuccess(data.experience));
        return data.experience;
    } catch (error) {
        dispatch(cvGenerateExperienceFail(error.response?.data?.message || 'Failed to generate experience points'));
        throw error;
    }
};

export const suggestSkills = (jobTitle, industry) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Please log in first');
        }

        dispatch(cvSuggestSkillsRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${API_BASE_URL}/cv/suggest-skills`,
            { jobTitle, industry },
            config
        );

        dispatch(cvSuggestSkillsSuccess(data.skills));
        return data.skills;
    } catch (error) {
        dispatch(cvSuggestSkillsFail(error.response?.data?.message || 'Failed to suggest skills'));
        throw error;
    }
};

export const getTemplateRecommendation = (industry) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Please log in first');
        }

        dispatch(cvTemplateRecommendRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${API_BASE_URL}/cv/template-recommendation`,
            { industry },
            config
        );

        dispatch(cvTemplateRecommendSuccess(data.template));
        return data.template;
    } catch (error) {
        dispatch(cvTemplateRecommendFail(error.response?.data?.message || 'Failed to recommend template'));
        throw error;
    }
};

export const generatePDF = (cvData, template) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Please log in first');
        }

        dispatch(cvGenerateRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${API_BASE_URL}/cv/generate-pdf`,
            { cvData, template },
            config
        );

        dispatch(cvGenerateSuccess(data.cv));
        return data.cv;
    } catch (error) {
        dispatch(cvGenerateFail(error.response?.data?.message || 'Failed to generate CV'));
        throw error;
    }
};
