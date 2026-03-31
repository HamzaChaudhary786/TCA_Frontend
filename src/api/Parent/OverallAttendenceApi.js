import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../constants/api";
import axios from "axios";



export const useGetAllSubjectAttendence = (studentId) => {


    const getAllSubjectsAttendenceRequest = async () => {
        const url = `${BACKEND_URL}/classroom/attendence/student-all-subjects-attendence/${studentId}`;
        const response = await axios.get(url);

        // Note: Axios does not use response.ok, so check the status code directly
        if (response.status !== 200) {
            throw new Error('Failed to get all subject attendence');
        }

        return response.data; // Axios automatically parses the JSON response
    };

    // Updated useQuery call with object form
    const { data: studentAllSubjectsAttendence, isLoading, error } = useQuery({
        queryKey: ['fetchAllSubjectAttendence', studentId],
        queryFn: getAllSubjectsAttendenceRequest,
        enabled: !!studentId, // Only run the query if levelId is truthy

    });

    if (error) {
        toast.error(error.toString());
    }

    return {
        isLoading,
        studentAllSubjectsAttendence,
    };
};
