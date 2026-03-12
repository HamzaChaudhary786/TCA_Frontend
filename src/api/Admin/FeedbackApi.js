import axios from "axios";
import apiRequest from "../../utils/ApiRequest";
import { BACKEND_URL } from "../../constants/api";

axios.defaults.withCredentials = true;

export const getUserFeedback = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/feedback/${id}`
    const response = await axios.get(url);
    return response;
})

export const acceptFeedback = apiRequest(async (feedbackID) => {
    const url = `${BACKEND_URL}/feedback/accept/${feedbackID}`
    const response = await axios.patch(url);
    return response;
})

export const rejectFeedback = apiRequest(async (feedbackID) => {
    const url = `${BACKEND_URL}/feedback/reject/${feedbackID}`
    const response = await axios.patch(url);
    return response;
})

export const deleteFeedback = apiRequest(async (feedbackID) => {
    const url = `${BACKEND_URL}/feedback/${feedbackID}`
    const response = await axios.delete(url);
    return response;
})
