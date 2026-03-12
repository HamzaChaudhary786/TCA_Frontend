import axios from "axios";
import { BACKEND_URL } from "../../constants/api";
import apiRequest from "../../utils/ApiRequest";
import { useQuery } from "@tanstack/react-query";

axios.defaults.withCredentials = true;

export const getAllLevels = apiRequest(async () => await axios.get(`${BACKEND_URL}/level`));

export const createLevel = apiRequest(async (data) => await axios.post(`${BACKEND_URL}/level`, data));

export const editLevel = apiRequest(async (data, id) => await axios.put(`${BACKEND_URL}/level/${id}`, data));

export const deleteLevel = apiRequest(async (id) => await axios.delete(`${BACKEND_URL}/level/${id}`));

export const useGetLevels = () => {
    const fetchLevels = async () => {
        const response = await axios.get(`${BACKEND_URL}/level`);
        if (response.status !== 200) throw new Error('Failed to fetch levels');
        return response.data;
    };

    const { data: levels = [], isLoading: levelsLoading } = useQuery({
        queryKey: ['fetchAllLevels'],
        queryFn: fetchLevels,
    });

    return { levels, levelsLoading };
};
