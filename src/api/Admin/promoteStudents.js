import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../constants/api";
import { useMutation } from "@tanstack/react-query";
axios.defaults.withCredentials = true;


export const useStudentPromotion = () => {
  // POST API request to promote students
  const promoteStudentsRequest = async (promotionData) => {
    const response = await axios.post(
      `${BACKEND_URL}/admin/student-promote`,
      promotionData,
      { withCredentials: true } // optional: for cookie-based auth
    ); 

    if (response.status !== 201) {
      throw new Error("Failed to promote students");
    }

    return response.data;
  };

  // Mutation using react-query
  const { mutate, isLoading, isError, isSuccess } = useMutation({
    mutationFn: promoteStudentsRequest,
    onSuccess: () => {
      toast.success("Students promoted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to promote students");
    },
  });

  return {
    promoteStudents: mutate,
    isLoading,
    isError,
    isSuccess,
  };
};
