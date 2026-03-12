import axios from "axios";
import apiRequest from "../utils/ApiRequest";

import { toast } from "react-toastify";
import { BACKEND_URL } from "../constants/api";

axios.defaults.withCredentials = true;

export const getAllAnnouncements = apiRequest(async () => await axios.get(`${BACKEND_URL}/announcement/annoouncement`));

export const getAllNotifications = apiRequest(async () => await axios.get(`${BACKEND_URL}/notification`));

export const userLogout = apiRequest(async () => {
    const url = `${BACKEND_URL}/user/logout`
    const response = await axios.get(url);
    toast.success("Log out successfull!");
    return response;
});


export const getAllClasses = apiRequest(async (teacherID) => {

    let endDate = new Date(Date.now());
    endDate.setDate(endDate.getDate() - 15);
    let startDate = new Date(Date.now());
    startDate.setDate(startDate.getDate() + 15);

    // const url = `${BACKEND_URL}/class?startDate=${endDate}&endDate=${startDate}${teacherID ? `&teacherID=${teacherID}` : ''}`;
    const id = typeof teacherID === 'object' ? teacherID?._id : teacherID;
    const url = `${BACKEND_URL}/class?startDate=${endDate}&endDate=${startDate}${id ? `&teacherID=${id}` : ''}`;
    const response = await axios.get(url);
    return response

})
