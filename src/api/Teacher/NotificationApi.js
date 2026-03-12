import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../constants/api";
import axios from "axios";

export const useGetNotifications = () => {
    const getNotificationsRequest = async () => {
        const url = `${BACKEND_URL}/notification`;
        const response = await axios.get(url, { withCredentials: true });

        if (response.status !== 200) {
            throw new Error('Failed to get notifications');
        }

        return response.data;
    };

    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ['fetchNotifications'],
        queryFn: getNotificationsRequest,
    });

    if (error) {
        toast.error(error.toString());
    }

    return {
        isLoading,
        notifications,
    };
};
