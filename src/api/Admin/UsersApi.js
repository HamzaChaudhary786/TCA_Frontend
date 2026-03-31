import axios from "axios";
import apiRequest from "../../utils/ApiRequest";
import { BACKEND_URL } from "../../constants/api";

axios.defaults.withCredentials = true;

// export const acceptUser = async (id) => {
//     const url = `${BACKEND_URL}/user/accept/${id}`
//     try {
//         const response = await axios.put(url);
//         return response?.data;
//     } catch (error) {
//         console.log(`error on url: ${url} is : `, error);
//         toast.error(error?.response?.data);
//         return "error"
//     }
// }


export const acceptUser = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/user/accept/${id}`
    const response = await axios.put(url);
    return response;
})

export const rejectUser = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/user/reject/${id}`
    const response = await axios.delete(url);
    return response;
})

// export const rejectUser = async (id) => {
//     const url = `${BACKEND_URL}/user/reject/${id}`
//     try {
//         const response = await axios.delete(url);
//         return response?.data;
//     } catch (error) {
//         console.log(`error on url: ${url} is : `, error);
//         toast.error(error?.response?.data);
//         return "error"
//     }
// }

export const updateUser = apiRequest(async (data, id) => {
    const url = `${BACKEND_URL}/user/admin/user/${id}`
    console.log("data for updating usr for admin is : ", data);
    const response = await axios.put(url, data);
    return response;
})

export const updatePassword = apiRequest(async (data) => {
    const url = `${BACKEND_URL}/user/update-password`
    console.log("data for updating usr for admin is : ", data);
    const response = await axios.put(url, data);
    return response;
})

export const deleteUser = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/user/admin/user/${id}`
    const response = await axios.delete(url);
    return response;
})

export const updateSelfProfile = apiRequest(async (data) => {
    const url = `${BACKEND_URL}/user/update`
    const response = await axios.put(url, data);
    return response;
})

export const getStudentSubjectsForAdmin = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/user/student-subjects/${id}`
    const response = await axios.get(url);
    return response;
})

export const getStudentSubjectsWithLevel = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/user/student-subjects-with-level/${id}`
    const response = await axios.get(url);
    return response;
})


export const updateStudentSubjects = apiRequest(async ({ studentId, subjects }) => {
    const url = `${BACKEND_URL}/user/admin/user/update-student-subject/${studentId}`
    console.log("data for updating usr for admin is : ", subjects);
    const response = await axios.put(url, subjects);
    return response;
})
