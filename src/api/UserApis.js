import axios from "axios";
import { BACKEND_URL } from "../constants/api";
import apiRequest from "../utils/ApiRequest";

axios.defaults.withCredentials = true;

export const updateUser = apiRequest(async (data) => {
    const url = `${BACKEND_URL}/user/update`
    const response = await axios.post(url, data);
    return response;
})

export const getMyChats = apiRequest(async() =>{
    const url = `${BACKEND_URL}/chatroom`
    const response = await axios.get(url);
    return response;
})

export const getChatsRoomData = apiRequest(async(id) =>{
    const url = `${BACKEND_URL}/chatroom/${id}`
    const response = await axios.get(url);
    return response;
})

export const sendQuickMessage = apiRequest(async (data) => {
    const url = `${BACKEND_URL}/chatroom/message`;
    const response = await axios.post(url, data);
    return response;
});

export const getTeachersForChat = apiRequest(async () => {
    const url = `${BACKEND_URL}/chatroom/chat/teachers`;
    const response = await axios.get(url);
    return response;
});
