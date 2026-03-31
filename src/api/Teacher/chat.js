import axios from "axios";
import { BACKEND_URL } from "../../constants/api";
import apiRequest from "../../utils/ApiRequest";

axios.defaults.withCredentials = true;

export const getParentsForChat = apiRequest(async() =>{
    const url = `${BACKEND_URL}/chatroom/chat/parents`
    const response = await axios.get(url);
    return response;
})

export const getStudentsForChat = apiRequest(async() =>{
    const url = `${BACKEND_URL}/chatroom/chat/students`
    const response = await axios.get(url);
    return response;
})
