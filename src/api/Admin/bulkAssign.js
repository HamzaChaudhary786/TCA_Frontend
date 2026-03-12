import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../constants/api";

export const useBulkAssignSubjects = () => {
    // POST request to assign subjects in bulk
    const bulkAssignSubjects = async (assignData) => {
        const response = await axios.post(
            `${BACKEND_URL}/user/admin/bulk-update-student-subjects`,
            assignData,
            { withCredentials: true }
        );

        if (response.status !== 200 && response.status !== 201) {
            throw new Error(response.data.message || "Failed to bulk assign subjects");
        }

        return response.data;
    };

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: bulkAssignSubjects,
        onSuccess: (data) => {
            toast.success(data.message || "Subjects assigned successfully!");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || error.message || "Failed to assign subjects");
        },
    });

    return {
        bulkAssignSubjects: mutate,
        isLoading,
    };
};

export const useUpdateStudentSubject = () => {
    const updateStudentSubject = async ({ studentId, subjectIds }) => {
        // Expected payload is just the array of subjects directly on req.body for this older route
        const response = await axios.put(
            `${BACKEND_URL}/user/admin/user/update-student-subject/${studentId}`,
            subjectIds,
            { withCredentials: true }
        );

        if (response.status !== 200 && response.status !== 201) {
            throw new Error(response.data.message || "Failed to update student subject");
        }

        return response.data;
    };

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: updateStudentSubject,
        onSuccess: (data) => {
            toast.success("Student subjects updated successfully!");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || error.message || "Failed to update subject");
        },
    });

    return {
        updateStudentSubject: mutate,
        isLoading,
    };
};
