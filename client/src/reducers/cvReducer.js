import {
  CV_GENERATE_REQUEST,
  CV_GENERATE_SUCCESS,
  CV_GENERATE_FAIL,
  CV_SAVE_REQUEST,
  CV_SAVE_SUCCESS,
  CV_SAVE_FAIL,
  CV_SUGGEST_OBJECTIVE_REQUEST,
  CV_SUGGEST_OBJECTIVE_SUCCESS,
  CV_SUGGEST_OBJECTIVE_FAIL,
  CV_GENERATE_EXPERIENCE_REQUEST,
  CV_GENERATE_EXPERIENCE_SUCCESS,
  CV_GENERATE_EXPERIENCE_FAIL,
  CV_SUGGEST_SKILLS_REQUEST,
  CV_SUGGEST_SKILLS_SUCCESS,
  CV_SUGGEST_SKILLS_FAIL
} from '../actions/CVActions';

const initialState = {
  isGeneratingPDF: false,
  pdfError: null,
  saved: false,
  suggestions: {
    careerObjective: null,
    experiences: [],
    skills: []
  }
};

const cvReducer = (state = initialState, action) => {
  switch (action.type) {
    case CV_GENERATE_REQUEST:
      return {
        ...state,
        isGeneratingPDF: true,
        pdfError: null
      };

    case CV_GENERATE_SUCCESS:
      return {
        ...state,
        isGeneratingPDF: false,
        pdfError: null
      };

    case CV_GENERATE_FAIL:
      return {
        ...state,
        isGeneratingPDF: false,
        pdfError: action.error
      };

    case CV_SAVE_REQUEST:
      return {
        ...state,
        saved: false
      };

    case CV_SAVE_SUCCESS:
      return {
        ...state,
        saved: true
      };

    case CV_SAVE_FAIL:
      return {
        ...state,
        saved: false
      };

    case CV_SUGGEST_OBJECTIVE_REQUEST:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          careerObjective: null
        }
      };

    case CV_SUGGEST_OBJECTIVE_SUCCESS:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          careerObjective: action.objective
        }
      };

    case CV_SUGGEST_OBJECTIVE_FAIL:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          careerObjective: null
        }
      };

    case CV_GENERATE_EXPERIENCE_REQUEST:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          experiences: []
        }
      };

    case CV_GENERATE_EXPERIENCE_SUCCESS:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          experiences: action.experience
        }
      };

    case CV_GENERATE_EXPERIENCE_FAIL:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          experiences: []
        }
      };

    case CV_SUGGEST_SKILLS_REQUEST:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          skills: []
        }
      };

    case CV_SUGGEST_SKILLS_SUCCESS:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          skills: action.skills
        }
      };

    case CV_SUGGEST_SKILLS_FAIL:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          skills: []
        }
      };

    default:
      return state;
  }
};

export default cvReducer;
