import axios from "axios";
import { BACKEND_URL } from "../../constants/api";
import apiRequest from "../../utils/ApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const getTodayClasses = apiRequest(async () => {

    let endDate = new Date();
    let startDate = new Date();
    endDate.setDate(endDate.getDate() + 8);

    const url = `${BACKEND_URL}/class/get-today-classes?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
    const response = await axios.get(url);
    return response;

});


export const markAttendence = apiRequest(async (data, classID, classroomID, startTime) => {

    const url = `${BACKEND_URL}/class/get-today-classes/${classID}`;
    const response = await axios.put(url, { data, classroomID, startTime });
    return response;

});

export const markHeadAttendence = apiRequest(async (data, id, date) => {

    console.log(" dataand id is : ", data, id);

    const url = `${BACKEND_URL}/classroom/attendence/add-classroom-attendence/${id}`;
    const response = await axios.post(url, { data, date });
    return response;

});

export const useGetAttandenceOfClassroom = (classroomID, date) => {


    const getMyAttandenceOfClassroom = async () => {
        const url = `${BACKEND_URL}/classroom/attendence/get-attandence/${classroomID}?date=${date}`;
        const response = await axios.get(url);
        // Note: Axios does not use response.ok, so check the status code directly
        if (response.status !== 200) {
            throw new Error('Failed to get user');
        }
        return response.data; // Axios automatically parses the JSON response
    };

    // Updated useQuery call with object form
    const { data: getAttandence, isLoading, error } = useQuery({
        queryKey: ['fetchAttandenceGet', classroomID, date],
        queryFn: getMyAttandenceOfClassroom,
        enabled: !!classroomID && !!date,
    });

    // if (error) {
    //     toast.error(error.toString());
    // }

    return {
        isLoading,
        getAttandence,
    };
};


export const useUpdateAttandenceOfClassroom = () => {
    // Function to update attendance
    const updateMyAttandenceOfClassroom = async ({ data, classroomID, date }) => {
        const url = `${BACKEND_URL}/classroom/attendence/update-attandence/${classroomID}`;
        const response = await axios.put(url, {
            data,
            date,
        });

        if (response.status !== 200) {
            throw new Error('Failed to update attendance');
        }

        return response.data;
    };

    // Using `useMutation` for the API call
    const queryClient = useQueryClient();
    const { mutateAsync: updateAttandence, isLoading, isSuccess, error } = useMutation(
        {
            mutationKey: ["update-attendence",],
            mutationFn: updateMyAttandenceOfClassroom,

            onSuccess: () => {
                toast.success("Attendance Updated Successfully!");
                // Invalidate all relevant queries for all roles to ensure reports "progress"
                queryClient.invalidateQueries(["assignment"]);
                queryClient.invalidateQueries(["quiz"]);
                queryClient.invalidateQueries(["reports"]);
                queryClient.invalidateQueries(["report"]);
                queryClient.invalidateQueries(["studentReports"]);
                queryClient.invalidateQueries(["teacherStudets"]);
                queryClient.invalidateQueries(["student-assignments-quizes"]);
                queryClient.invalidateQueries(["fetchAttandenceGet"]);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        }
    );

    return {
        isLoading,
        isSuccess,
        updateAttandence,
        error,
    };
};



export const teacherPresent = apiRequest(async (id) => {
    const url = `${BACKEND_URL}/class/mark/${id}`
    const response = await axios.get(url);
    return response;
})

