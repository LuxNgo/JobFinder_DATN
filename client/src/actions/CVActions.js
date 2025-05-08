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



// API Actions
export const generateCV = (cvData, template) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Vui lòng đăng nhập trước');
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
          toast.success('CV đã được tạo thành công!');
          return cvContent;
        } else {
          throw new Error('Nội dung CV không hợp lệ');
        }
    } catch (error) {
        dispatch(cvGenerateFail(error.response?.data?.message || 'Lỗi khi tạo CV'));
        toast.error(error.response?.data?.message || 'Lỗi khi tạo CV');
        throw error;
    }
};

export const suggestCareerObjective = (jobTitle, industry) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Vui lòng đăng nhập trước');
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
        dispatch(cvSuggestObjectiveFail(error.response?.data?.message || 'Lỗi khi gợi ý mục tiêu nghề nghiệp'));
        throw error;
    }
};

export const generateWorkExperience = (experience) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Vui lòng đăng nhập trước');
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
        dispatch(cvGenerateExperienceFail(error.response?.data?.message || 'Lỗi khi tạo kinh nghiệm'));
        throw error;
    }
};

export const suggestSkills = (jobTitle, industry) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('Vui lòng đăng nhập trước');
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
        dispatch(cvSuggestSkillsFail(error.response?.data?.message || 'Lỗi khi gợi ý kỹ năng'));
        throw error;
    }
};



export const generatePDF = (data) => async (dispatch) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            dispatch(cvGenerateFail('Vui lòng đăng nhập trước'));
            toast.error('Vui lòng đăng nhập trước');
            return;
        }

        dispatch(cvGenerateRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob' // Handle binary PDF response
        };

        const response = await axios.post(
            `${API_BASE_URL}/cv/generate-pdf`,
            data,
            config
        );
        toast.success('CV PDF đã được tải xuống!');

        
        // Create a blob URL for the PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Create a download link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.cvData.personalInfo?.fullName || 'CV'}_CV.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        dispatch(cvGenerateSuccess({ message: 'CV PDF đã được tải xuống!' }));
        toast.success('CV PDF đã được tải xuống!');
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Lỗi khi tạo PDF';
        dispatch(cvGenerateFail(errorMessage));
        // toast.error(errorMessage);
    }
};
