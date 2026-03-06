import axios from "axios";
import apiRequest from "../../utils/ApiRequest";
import { BACKEND_URL } from "../../constants/api";

axios.defaults.withCredentials = true;

export const getUserFeedback = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/feedback/${id}`
    const response = await axios.get(url);
    return response;
}) 
